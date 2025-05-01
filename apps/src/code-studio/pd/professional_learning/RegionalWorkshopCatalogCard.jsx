import {navigateToHref} from '@code-dot-org/apps/utils';
import {
  Button,
  LinkButton,
  buttonColors,
} from '@code-dot-org/component-library/button';
import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import Tags from '@code-dot-org/component-library/tags';
import {
  BodyOneText,
  BodyTwoText,
  OverlineTwoText,
} from '@code-dot-org/component-library/typography';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import {getAuthenticityToken} from '@cdo/apps/util/AuthenticityTokenStore';

import {SUBMISSION_STATUSES} from '../workshop_enrollment/constants';

import style from './regionalWorkshopCatalog.module.scss';

const RegionalWorkshopCatalogCard = ({
  id,
  course,
  subject,
  name,
  capacity,
  numEnrollments,
  sessionTimes,
  format,
  locationName,
  fee,
  hasPrereq,
  requiresApplication,
  customApplicationLink,
  customRegistrationLink,
}) => {
  const seatsRemaining = capacity - numEnrollments;
  const isFull = seatsRemaining <= 0;
  const workshopTitle = name ? name : `${course}: ${subject}`;
  const workshopSessionsText =
    sessionTimes.length > 1
      ? `${sessionTimes[0]} + ${sessionTimes.length - 1} More`
      : sessionTimes[0];
  const prereqText = hasPrereq ? 'Has prerequisites' : 'No prerequisites';
  const [enrollmentIsPending, setEnrollmentIsPending] = useState(false);

  const enrollInWorkshop = async () => {
    setEnrollmentIsPending(true);

    try {
      const params = {
        // user_id: props.user_id,
        // first_name: formState.first_name,
        // last_name: formState.last_name,
        // email: formState.email,
        // school_info: buildSchoolData({
        //   schoolId: schoolInfo.schoolId,
        //   country: schoolInfo.country,
        //   schoolName: schoolInfo.schoolName,
        //   schoolZip: schoolInfo.schoolZip,
        // }),
        // role: getRole(),
        // describe_role: formState.describe_role,
        // grades_teaching: getGradesTeaching(),
        // explain_teaching_other: formState.explain_teaching_other,
        // explain_not_teaching: formState.explain_not_teaching,
        // csf_course_experience: formState.csf_course_experience,
        // csf_courses_planned: getCsfCoursesPlanned(),
        // explain_csf_course_other: formState.explain_csf_course_other,
        // attended_csf_intro_workshop:
        //   ATTENDED_CSF_COURSES_OPTIONS[formState.attended_csf_intro_workshop],
        // previous_courses: formState.previous_courses,
        // csf_intro_intent: formState.csf_intro_intent,
        // csf_intro_other_factors: formState.csf_intro_other_factors,
        // years_teaching: formState.years_teaching,
        // years_teaching_cs: formState.years_teaching_cs,
        // taught_ap_before: formState.taught_ap_before,
        // planning_to_teach_ap: formState.planning_to_teach_ap,
      };

      const response = await fetch(`/api/v1/pd/workshops/${id}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': await getAuthenticityToken(),
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();
      switch (result.workshop_enrollment_status) {
        case SUBMISSION_STATUSES.UNKNOWN_ERROR:
          alert(result.error_message || 'Unknown error occurred');
          break;
        case SUBMISSION_STATUSES.DUPLICATE:
          alert(
            <p>
              You are already registered, and should have received a
              confirmation email. If you need to cancel, click{' '}
              <a href={result.cancel_url}>{result.cancel_url}</a>
              {'.'}
            </p>
          );
          break;
        case SUBMISSION_STATUSES.OWN:
          alert('You are attempting to join your own workshop.');
          break;
        case SUBMISSION_STATUSES.CLOSED:
          alert('Sorry, this workshop is closed.');
          break;
        case SUBMISSION_STATUSES.FULL:
          alert('Sorry, this workshop is full.');
          break;
        case SUBMISSION_STATUSES.NOT_FOUND:
          alert('Sorry, this workshop could not be found.');
          break;
        case SUBMISSION_STATUSES.SUCCESS:
          // Redirect to My PL landing page. The WORKSHOP_ENROLLMENT_COMPLETED_EVENT event will be logged
          // on that page since event logs immediately followed by redirects sometimes do not fire.
          sessionStorage.setItem(
            'rpName',
            this.props.workshop.regional_partner?.name || ''
          );
          sessionStorage.setItem('workshopCourse', this.props.workshop.course);
          sessionStorage.setItem(
            'workshopSubject',
            this.props.workshop.subject || ''
          );
          sessionStorage.setItem(
            'workshopName',
            this.props.workshop.name || ''
          );
          sessionStorage.setItem(
            'workshopLocation',
            this.props.workshop_location_for_calendar || ''
          );
          sessionStorage.setItem(
            'sessionTimeInfo',
            JSON.stringify(this.props.session_info_for_calendar)
          );

          navigateToHref('/my-professional-learning');
      }
    } catch (error) {
      alert(`There was an error enrolling you in the workshop: ${error}`);
      console.error(error);
    } finally {
      setEnrollmentIsPending(false);
    }
  };

  const RenderApplyOrEnrollButton = () => {
    if (requiresApplication) {
      // Sends user to third-party application link if available.
      if (customApplicationLink) {
        return (
          <LinkButton
            text="Apply now"
            target="_blank"
            color="purple"
            iconRight={{iconName: 'up-right-from-square'}}
            href={customApplicationLink}
            className={style.wsCardButton}
            disabled={isFull}
          />
        );
      } else {
        // Sends user to fill out teacher application if no third-party application
        // link.
        return (
          <LinkButton
            text="Apply now"
            target="_blank"
            color="purple"
            href="/pd/application/teacher"
            className={style.wsCardButton}
            disabled={isFull}
          />
        );
      }
    } else {
      if (customRegistrationLink) {
        // Sends user to third-party workshop registration link if available.
        return (
          <LinkButton
            text="Enroll now"
            target="_blank"
            color="purple"
            iconRight={{iconName: 'up-right-from-square'}}
            href={customRegistrationLink}
            className={style.wsCardButton}
            disabled={isFull}
          />
        );
      } else {
        // One-click enrolls the user in the workshop and sends them to the
        // My-PL page if no third-party workshop registration link.
        return (
          <Button
            text="Enroll now"
            target="_blank"
            color="purple"
            onClick={enrollInWorkshop}
            className={style.wsCardButton}
            isPending={enrollmentIsPending}
            disabled={isFull}
          />
        );
      }
    }
  };

  return (
    <div className={style.workshopCatalogCard}>
      <div className={style.workshopContent}>
        <div className={style.titleBlock}>
          <Tags
            tagsList={[
              {
                label: isFull ? 'Full' : `${seatsRemaining} Seats Remaining`,
                icon: {
                  iconName: isFull ? 'users' : 'user-plus',
                  iconStyle: 'solid',
                  placement: 'left',
                },
              },
            ]}
            size="s"
            className={classNames(
              style.capacityTag,
              isFull ? style.fullCapacityTag : style.spotsOpenCapacityTag
            )}
          />
          <BodyOneText className={style.wsTitle}>{workshopTitle}</BodyOneText>
          <OverlineTwoText className={style.gradeNote}>
            FOR TEACHERS OF GRADES:
          </OverlineTwoText>
          <p>1, 2, 3, 4, 5</p>
        </div>
        <div className={style.infoBlock}>
          <span className={style.infoLine}>
            <div className={style.infoLineIconContainer}>
              <FontAwesomeV6Icon iconName={'calendar'} />
            </div>
            <BodyTwoText>{workshopSessionsText}</BodyTwoText>
          </span>
          <span className={style.infoLine}>
            <div className={style.infoLineIconContainer}>
              <FontAwesomeV6Icon iconName={'screen-users'} />
            </div>
            <BodyTwoText>{`${format} workshop`}</BodyTwoText>
          </span>
          {locationName && (
            <span className={style.infoLine}>
              <div className={style.infoLineIconContainer}>
                <FontAwesomeV6Icon iconName={'building'} />
              </div>
              <BodyTwoText>{locationName}</BodyTwoText>
            </span>
          )}
          <span className={style.infoLine}>
            <div className={style.infoLineIconContainer}>
              <FontAwesomeV6Icon iconName={'dollar-circle'} />
            </div>
            <BodyTwoText>{fee ? fee : 'Free'}</BodyTwoText>
          </span>
          <span className={style.infoLine}>
            <div className={style.infoLineIconContainer}>
              <FontAwesomeV6Icon iconName={'arrow-up-wide-short'} />
            </div>
            <BodyTwoText>{prereqText}</BodyTwoText>
          </span>
        </div>
      </div>
      <div className={style.buttonContainer}>
        <LinkButton
          text="Learn more"
          type="secondary"
          target="_blank"
          color={buttonColors.black}
          href={`/pd/workshops/${id}/enroll`}
          className={style.wsCardButton}
        />
        {RenderApplyOrEnrollButton()}
      </div>
    </div>
  );
};

RegionalWorkshopCatalogCard.propTypes = {
  id: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  subject: PropTypes.string,
  name: PropTypes.string,
  capacity: PropTypes.number.isRequired,
  numEnrollments: PropTypes.number.isRequired,
  sessionTimes: PropTypes.arrayOf(PropTypes.string).isRequired,
  format: PropTypes.string.isRequired,
  locationName: PropTypes.string,
  fee: PropTypes.string,
  hasPrereq: PropTypes.bool.isRequired,
  requiresApplication: PropTypes.bool.isRequired,
  customApplicationLink: PropTypes.string,
  customRegistrationLink: PropTypes.string,
};

export default RegionalWorkshopCatalogCard;
