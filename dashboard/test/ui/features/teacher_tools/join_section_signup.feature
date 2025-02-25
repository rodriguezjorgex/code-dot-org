# Sign up for account through /join/:section_code endpoint with invalid and valid form inputs
# Users see sign up form when they attempt to join section without being signed in
Feature: Using the join section page while not signed in

  Scenario: Attempt to join section while signed out
    Given I am a teacher
    And I create a new student section and go home
    And I save the student section url

    # Have new user join section with invalid password
    Given I sign out
    And I attempt to join the section
    And I wait until element "a:contains(Create an account)" is visible
    Then I click selector "a:contains(Create an account)"
    And I wait until I am on "http://studio.code.org/users/new_sign_up/login_type?user_type=student&user_return_to=/join/#{section_code}"

  Scenario: Attempt to join section while signed in
    Given I am a teacher
    And I create a new student section and go home
    And I save the student section url

    # Have new user join section with valid form inputs
    Given I sign out
    Given I am a student
    And I join the section
    Then I wait until I am on "http://studio.code.org/home"
