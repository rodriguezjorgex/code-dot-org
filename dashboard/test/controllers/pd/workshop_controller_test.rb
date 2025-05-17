require 'test_helper'
class Pd::WorkshopControllerTest < ActionController::TestCase
  setup do
    @workshop = create :workshop
  end

  test 'non-logged-in users are prompted with sign in gate' do
    get :index, params: {workshop_id: @workshop.id}

    assert_response :success
    assert_template :logged_out
  end

  test 'student users are prompted with account upgrade gate' do
    student = create :student
    sign_in student
    get :index, params: {workshop_id: @workshop.id}

    assert_response :success
    assert_template :students_cannot_enroll
  end

  test 'teacher users are prompted with sign in gate' do
    teacher = create :teacher
    sign_in teacher
    get :index, params: {workshop_id: @workshop.id}

    assert_response :success
    assert_template :index
  end
end
