require 'test_helper'

class UserLevelEvaluationsControllerTest < ActionController::TestCase
  include LevelsHelper
  setup do
    @teacher = create(:teacher)
    @section = create(:section, user: @teacher, login_type: 'word')
    @student = create(:follower, section: @section).student_user
    @script = create(:csp_script, :with_levels, version_year: '2024', family_name: 'csp', is_course: true)
    CourseOffering.add_course_offering(@script)
    @level = @script.levels.first
    @ule_params = {
      level_id: @level.id,
      unitId: @script.id,
      evaluation_criteria: 'Did the student answer the question?',
      ai_evaluation: 'Yes',
      ai_reasoning: 'The student answered the question.',
      ai_model_version: 'robots-1.0',
    }
  end

  test "User can create their own User Level Evaluation" do
    sign_in @student
    @ule_params["user_id"] = @student.id
    assert_creates(UserLevelEvaluation) do
      post :create, params: @ule_params
    end
  end

  test "Teacher can create User Level Evaluation for student in their section" do
    sign_in @teacher
    @ule_params[:user_id] = @student.id
    assert_creates(UserLevelEvaluation) do
      post :create, params: @ule_params
    end
  end

  test "Teacher can not create User Level Evaluation for random student" do
    sign_in @teacher
    @ule_params[:user_id] = create(:student).id
    refute_creates(UserLevelEvaluation) do
      post :create, params: @ule_params
    end
  end
end
