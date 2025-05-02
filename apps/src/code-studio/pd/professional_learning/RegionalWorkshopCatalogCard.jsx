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
import {navigateToHref} from '@cdo/apps/utils';

import {getSessionDate, getSessionTimes} from '../sessionDateUtils';
import {COURSE_BUILD_YOUR_OWN} from '../workshop_dashboard/workshopConstants';
import {SUBMISSION_STATUSES} from '../workshop_enrollment/constants';

import style from './regionalWorkshopCatalog.module.scss';

const buildWorkshopStartText = sessions => {
  const firstSessionDate = getSessionDate({
    session: sessions[0],
    format: 'MM/DD/YY',
    isLocal: sessions[0].is_local,
  });
  const {startTime, endTime} = getSessionTimes({
    session: sessions[0],
    format: 'h:mmA',
    isLocal: sessions[0].is_local,
  });
  const firstSessionDateTime = `${firstSessionDate} (${startTime}-${endTime})`;

  return sessions.length > 1
    ? `${firstSessionDateTime} + ${sessions.length - 1} More`
    : firstSessionDateTime;
};

const RegionalWorkshopCatalogCard = ({
  id,
  course,
  subject,
  name,
  capacity,
  numEnrollments,
  sessions,
  format,
  locationName,
  fee,
  hasPrereq,
  requiresApplication,
  customApplicationLink,
  customRegistrationLink,
  userInfo,
  regionalPartnerName,
}) => {
  const seatsRemaining = capacity - numEnrollments;
  const isFull = seatsRemaining <= 0;
  const [enrollmentPending, setEnrollmentPending] = useState(false);

  const enrollInBuildYourOwnWorkshop = async () => {
    if (enrollmentPending) {
      return;
    }
    setEnrollmentPending(true);

    try {
      const response = await fetch(`/api/v1/pd/workshops/${id}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': await getAuthenticityToken(),
        },
        body: JSON.stringify(userInfo),
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
          sessionStorage.setItem('rpName', regionalPartnerName || '');
          sessionStorage.setItem('workshopCourse', course);
          sessionStorage.setItem('workshopSubject', subject || '');
          sessionStorage.setItem('workshopName', name || '');
          sessionStorage.setItem('workshopLocation', locationName || '');
          sessionStorage.setItem('sessionTimeInfo', JSON.stringify(sessions));

          navigateToHref('/my-professional-learning');
      }
    } catch (error) {
      alert(`There was an error enrolling you in the workshop: ${error}`);
      console.error(error);
    } finally {
      setEnrollmentPending(false);
    }
  };

  const RenderApplyOrEnrollButton = () => {
    if (requiresApplication) {
      if (customApplicationLink) {
        // Sends user to third-party application link if available.
        return (
          <LinkButton
            aria-label="applyNow"
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
            aria-label="applyNow"
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
            aria-label="enrollNow"
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
        if (course === COURSE_BUILD_YOUR_OWN) {
          // One-click enrolls the user in the workshop and sends them to the
          // My-PL page if it's a Build Your Own workshop with no third-party
          // workshop registration link.
          return (
            <Button
              aria-label="enrollNow"
              text="Enroll now"
              target="_blank"
              color="purple"
              onClick={enrollInBuildYourOwnWorkshop}
              className={style.wsCardButton}
              isPending={enrollmentPending}
              disabled={isFull}
            />
          );
        } else {
          // Sends user to workshop registration page.
          return (
            <LinkButton
              aria-label="enrollNow"
              text="Enroll now"
              target="_blank"
              color="purple"
              href={`/pd/workshops/${id}/enroll`}
              className={style.wsCardButton}
              disabled={isFull}
            />
          );
        }
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
          <BodyOneText className={style.wsTitle}>
            {name ? name : `${course}: ${subject}`}
          </BodyOneText>
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
            <BodyTwoText>{buildWorkshopStartText(sessions)}</BodyTwoText>
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
            <BodyTwoText>
              {hasPrereq ? 'Has prerequisites' : 'No prerequisites'}
            </BodyTwoText>
          </span>
        </div>
      </div>
      <div className={style.buttonContainer}>
        <LinkButton
          aria-label="learnMore"
          text="Learn more"
          type="secondary"
          target="_blank"
          color={buttonColors.black}
          href={`/pd/workshops/${id}/enroll`}
          className={style.wsCardButton}
          disabled={isFull}
        />
        {RenderApplyOrEnrollButton()}
      </div>
    </div>
  );
};

RegionalWorkshopCatalogCard.propTypes = {
  id: PropTypes.number.isRequired,
  course: PropTypes.string.isRequired,
  subject: PropTypes.string,
  name: PropTypes.string,
  capacity: PropTypes.number.isRequired,
  numEnrollments: PropTypes.number.isRequired,
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      is_local: PropTypes.bool.isRequired,
    })
  ).isRequired,
  format: PropTypes.string.isRequired,
  locationName: PropTypes.string,
  fee: PropTypes.string,
  hasPrereq: PropTypes.bool.isRequired,
  requiresApplication: PropTypes.bool.isRequired,
  customApplicationLink: PropTypes.string,
  customRegistrationLink: PropTypes.string,
  userInfo: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string.isRequired,
  }).isRequired,
  regionalPartnerName: PropTypes.string,
};

export default RegionalWorkshopCatalogCard;
