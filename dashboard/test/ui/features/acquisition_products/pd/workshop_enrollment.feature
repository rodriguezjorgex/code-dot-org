@dashboard_db_access
Feature: Workshop Enrollment

Scenario: Visiting old workshop enroll form redirects to join page
  Given I am a teacher
  And I visit the old enroll form page of a workshop
  And I wait until current URL contains "/join"

  # test clean up
  And I delete the workshop

Scenario: Attempting to join workshop signed-out prompts user to sign in
  Given I am a "signed_out" user enrolling in workshop with "unsubmitted" status
  And I wait until element "#new-account-card" is visible

  # test clean up
  And I delete the workshop

Scenario: Attempting to join workshop as a student prompts user to upgrade account
  Given I am a "student" user enrolling in workshop with "unsubmitted" status
  And I wait until element "#keep-student-account-card" is visible

  # test clean up
  And I delete the workshop

Scenario: Attempting to join invalid workshop as a teacher states it cannot be found
  Given I am a teacher
  And I am on "http://studio.code.org/pd/workshops/0/join"
  And I wait until element "h3:contains('Not found')" is visible

Scenario: Attempting to join closed workshop as a teacher states it is closed
  Given I am a "teacher" user enrolling in workshop with "closed" status
  And I wait until element "h3:contains('Closed')" is visible

  # test clean up
  And I delete the workshop

Scenario: Attempting to join full workshop as a teacher states it is full
  Given I am a "teacher" user enrolling in workshop with "full" status
  And I wait until element "h3:contains('Full')" is visible

  # test clean up
  And I delete the workshop

Scenario: Attempting to join own workshop as a teacher states it is your own workshop
  Given I am a "teacher" user enrolling in workshop with "own" status
  And I wait until element "h3:contains('Your own workshop')" is visible

  # test clean up
  And I delete the workshop

Scenario: Attempting to join workshop again as a teacher states you have already enrolled
  Given I am a "teacher" user enrolling in workshop with "duplicate" status
  And I wait until element "h3:contains('Duplicate enrollment')" is visible

  # test clean up
  And I delete the workshop

Scenario: Attempting to join workshop as a teacher allows enrolling and sends teacher to MyPL page
  Given I am a "teacher" user enrolling in workshop with "unsubmitted" status
  And I wait until element "h3:contains('Review your information')" is visible
  And I click "#joinWorkshop"
  And I wait until current URL contains "my-professional-learning"

  # test clean up
  And I delete the workshop
