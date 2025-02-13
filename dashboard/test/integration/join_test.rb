require 'test_helper'

class JoinTest < ActionDispatch::IntegrationTest
  test 'signed out /join with code in query param sends user to sign up' do
    section = create :section

    get "http://#{CDO.dashboard_hostname}/join?utf8=%E2%9C%93&section_code=#{section.code}&commit=Go"

    assert_response :redirect
    assert @response.headers['Location'].ends_with? "/users/sign_up/login_type?user_type=student&user_return_to=/join/#{section.code}"
  end

  test 'signed out /join with code in url sends user to sign up' do
    section = create :section

    get "http://#{CDO.dashboard_hostname}/join/#{section.code}"

    assert_response :redirect
    assert @response.headers['Location'].ends_with? "/users/sign_up/login_type?user_type=student&user_return_to=/join/#{section.code}"
  end

  test 'signed out /join without code sends user to sign up' do
    get "http://#{CDO.dashboard_hostname}/join"

    assert_response :redirect
    assert @response.headers['Location'].ends_with? "/users/sign_up/login_type?user_type=student&user_return_to=/join"
  end

  test 'signed in /join with code in query param successfully loads join page' do
    sign_in create :student
    section = create :section

    get "http://#{CDO.dashboard_hostname}/join?utf8=%E2%9C%93&section_code=#{section.code}&commit=Go"

    assert_response :success
  end

  test 'signed in /join with code in url successfully loads join page' do
    sign_in create :student
    section = create :section

    get "http://#{CDO.dashboard_hostname}/join/#{section.code}"

    assert_response :success
  end

  test 'signed in /join without code successfully loads join page' do
    sign_in create :student
    get "http://#{CDO.dashboard_hostname}/join"

    assert_response :success
  end
end
