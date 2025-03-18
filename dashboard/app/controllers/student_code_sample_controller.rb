class StudentCodeSampleController < ApplicationController
  authorize_resource class: false

  # GET /student_code_sample/fetch_student_code_samples
  def fetch_student_code_samples
    level_id = student_code_sample_params[:level_id]
    unit_id = student_code_sample_params[:unit_id]
    num_samples = student_code_sample_params[:num_samples].to_i

    return render json: [] if num_samples == 0
    check_valid_level(level_id)
    check_valid_unit(unit_id)

    if student_code_sample_params[:include_ai_evaluations]
      fetch_student_code_samples_with_evaluations(level_id, unit_id, num_samples)
    else
      fetch_student_code_samples_without_evaluations(level_id, unit_id, num_samples)
    end
  end

  def fetch_student_code_samples_without_evaluations(level_id, unit_id, num_samples)
    # We want to pull samples from students who have been assigned to work on the level.
    sections = Section.where(script_id: unit_id)
    student_ids = Follower.where(section: sections).pluck(:student_user_id)
    code_samples = []
    have_enough_samples = false
    student_ids.each do |student_id|
      unless have_enough_samples
        student_code = get_student_code(student_id, level_id, unit_id)
        if student_code[:student_code]
          code_samples << {level_id: level_id, unit_id: unit_id, user_id: student_id, project_id: student_code[:project_id], student_code: student_code[:student_code]}
        end
        have_enough_samples = code_samples.length >= num_samples
      end
    end
    render json: code_samples
  end

  def fetch_student_code_samples_with_evaluations(level_id, unit_id, num_samples)
    evaluations = UserLevelEvaluation.where(level_id: level_id, script_id: unit_id)
    if evaluations.empty?
      return render status: :not_found, json: "There are no evaluations for the level with id #{level_id} in unit with id #{unit_id}"
    end
    code_samples = []
    have_enough_samples = false
    evaluations.each do |evaluation|
      unless have_enough_samples
        student_code = get_student_code(evaluation.user_id, level_id, unit_id, evaluation.code_version)
        if student_code[:student_code]
          code_samples << {
            level_id: level_id,
            unit_id: unit_id,
            user_id: evaluation.user_id,
            project_id: student_code[:project_id],
            code_version: student_code[:code_version],
            student_code: student_code[:student_code],
            evaluation: evaluation.ai_evaluation,
            reasoning: evaluation.ai_reasoning,
            criteria: evaluation.evaluation_criteria
          }
        end
        have_enough_samples = code_samples.length >= num_samples
      end
    end
    render json: code_samples
  end

  def get_student_code(user_id, level_id, unit_id, code_version = nil)
    s3 = Aws::S3::Client.new
    bucket = CDO.sources_s3_bucket
    base_dir = CDO.sources_s3_directory

    storage_id = storage_id_for_user_id(user_id)
    channel_token = ChannelToken.where(storage_id: storage_id, level_id: level_id, script_id: unit_id).last
    user_level = UserLevel.where(user_id: user_id, level_id: level_id, script_id: unit_id).last
    if user_level && channel_token
      storage_app_id = channel_token.storage_app_id
      token = storage_encrypt_channel_id(storage_id, storage_app_id)
      _owner_storage_id, project_id = storage_decrypt_channel_id(token)
      s3_filename = "#{base_dir}/#{storage_id}/#{project_id}/main.json"
      body = s3.get_object(bucket: bucket, key: s3_filename, version_id: code_version)[:body].read
      student_code = JSON.parse(body)['source'] if body
    end
    {
      project_id: token,
      code_version: code_version,
      student_code: student_code,
    }
  end

  def check_valid_level(level_id)
    Level.find(level_id)
  rescue ActiveRecord::RecordNotFound
    return render status: :not_found, json: "Level with id #{level_id}"
  end

  def check_valid_unit(unit_id)
    Unit.find(unit_id)
  rescue ActiveRecord::RecordNotFound
    return render status: :not_found, json: "Unit with id #{unit_id}"
  end

  def student_code_sample_params
    student_code_sample_params = params.transform_keys(&:underscore).permit(
      :level_id,
      :unit_id,
      :num_samples,
      :include_ai_evaluations,
    )
    student_code_sample_params
  end
end
