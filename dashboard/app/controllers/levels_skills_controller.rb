class LevelsSkillsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  def create
    level_id = levels_skill_params[:level_id].to_i
    skill_id  = levels_skill_params[:skill_id].to_i

    begin
      Level.find(level_id)
    rescue ActiveRecord::RecordNotFound
      return render status: :not_found, json: "No level with id #{level_id}"
    end

    begin
      Skill.find(skill_id)
    rescue ActiveRecord::RecordNotFound
      return render status: :not_found, json: "No skill with id #{skill_id}"
    end

    @levels_skill = LevelsSkill.new(levels_skill_params)

    if @levels_skill.save
      render json: {status: 'success', message: 'LevelsSkill saved successfully'}, status: :created
    else
      render json: {status: 'error', message: @levels_skill.errors.full_messages.to_sentence}, status: :bad_request
    end
  end

  def delete
    level_id = levels_skill_params[:level_id].to_i
    skill_id = levels_skill_params[:skill_id].to_i
    begin
      level = Level.find(level_id)
      Skill.find(skill_id).levels.destroy(level)
      render json: {status: 'success', message: 'LevelsSkill deleted successfully'}, status: :ok
    rescue ActiveRecord::RecordNotFound
      render status: :not_found, json: "No LevelsSkill with level_id #{level_id} and skill_id #{skill_id}"
    end
  end

  private def levels_skill_params
    params.permit(
      :skillId,
      :levelId,
    ).transform_keys {|key| key.to_s.underscore.to_sym}
  end
end
