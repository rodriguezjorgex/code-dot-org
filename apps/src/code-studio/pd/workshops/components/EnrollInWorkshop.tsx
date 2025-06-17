import Alert from '@code-dot-org/component-library/alert';
import Button, {LinkButton} from '@code-dot-org/component-library/button';
import Link, {LinkProps} from '@code-dot-org/component-library/link';
import {
  Heading3,
  BodyThreeText,
} from '@code-dot-org/component-library/typography';
import React, {useState} from 'react';

import {SUBMISSION_STATUSES} from '@cdo/apps/code-studio/pd/workshop_enrollment/constants';
import {
  GetUserInfoForWorkshopResponse,
  GetWorkshopInfoScriptDataResponse,
} from '@cdo/apps/code-studio/pd/workshops/types';
import {navigateToHref} from '@cdo/apps/utils';

import {useWorkshopEnrollment} from './../hooks/useWorkshopEnrollment';

import moduleStyles from './../workshopMarketingPage.module.scss';

const WORKSHOP_ENROLL_SOURCE_PAGE = 'workshop enroll';

interface EnrollInWorkshopProps
  extends Pick<
      GetWorkshopInfoScriptDataResponse,
      | 'custom_registration_link'
      | 'num_enrollments'
      | 'capacity'
      | 'id'
      | 'regional_partner_name'
      | 'course'
      | 'sessions'
      | 'name'
      | 'format'
      | 'subject'
    >,
    GetUserInfoForWorkshopResponse {}
/** Component to display the enrollment information for a workshop. */
const EnrollInWorkshop: React.FC<EnrollInWorkshopProps> = ({
  id,
  custom_registration_link,
  num_enrollments,
  capacity,
  sessions,
  userInfo,
  regional_partner_name,
  course,
  format,
  name,
  subject,
}) => {
  const {
    submitEnrollment,
    isSubmitting,
    error = '',
  } = useWorkshopEnrollment(id);
  const [alertState, setAlertState] = useState({
    show: false,
    text: '',
    link: undefined as LinkProps | undefined,
  });

  const is_signed_out = !userInfo;
  const {is_student = false} = userInfo || {};

  const handleClick = async () => {
    const result = await submitEnrollment(
      userInfo && {
        user_id: userInfo.id,
        email: userInfo?.email,
        first_name: userInfo?.first_name,
        last_name: userInfo?.last_name,
      }
    );
    console.log(result);

    switch (result?.workshop_enrollment_status) {
      case SUBMISSION_STATUSES.DUPLICATE:
        setAlertState({
          show: true,
          text: ' You are already registered, and should have received a confirmation email.',
          link: {
            text: 'Cancel enrollment',
            href: result?.cancel_url,
          },
        });
        break;
      case SUBMISSION_STATUSES.OWN:
        setAlertState({
          show: true,
          text: 'You are attempting to join your own workshop.',
          link: undefined,
        });
        break;
      case SUBMISSION_STATUSES.CLOSED:
        setAlertState({
          show: true,
          text: 'Sorry, this workshop is closed. For more information, please contact the organizer.',
          link: undefined,
        });
        break;
      case SUBMISSION_STATUSES.FULL:
        setAlertState({
          show: true,
          text: 'Sorry, this workshop is full. For more information, please contact the organizer.',
          link: undefined,
        });
        break;
      case SUBMISSION_STATUSES.NOT_FOUND:
        setAlertState({
          show: true,
          text: 'Sorry, we could not find this workshop. Please check the link and try again.',
          link: undefined,
        });
        break;
      case SUBMISSION_STATUSES.SUCCESS:
        // Redirect to My PL landing page. The WORKSHOP_ENROLLMENT_COMPLETED_EVENT event will be logged
        // on that page since event logs immediately followed by redirects sometimes do not fire.
        sessionStorage.setItem('rpName', regional_partner_name || '');
        sessionStorage.setItem('workshopId', `${id}`);
        sessionStorage.setItem('workshopCourse', course);
        sessionStorage.setItem('workshopSubject', subject || '');
        sessionStorage.setItem('workshopName', name || '');
        sessionStorage.setItem('workshopFormat', format);
        sessionStorage.setItem('sessionTimeInfo', JSON.stringify(sessions));

        navigateToHref('/my-professional-learning');

        break;
      default:
    }
  };

  const isFull = num_enrollments >= capacity;

  const buildEnrollButtonLink = (enrollLink: string) => {
    if (is_signed_out) {
      return `/logged_out?source_page=${encodeURIComponent(
        WORKSHOP_ENROLL_SOURCE_PAGE
      )}&return_to=${encodeURIComponent(enrollLink)}`;
    }

    if (is_student) {
      return `/teacher_account_required?source_page=${encodeURIComponent(
        WORKSHOP_ENROLL_SOURCE_PAGE
      )}&return_to=${encodeURIComponent(enrollLink)}`;
    }

    return enrollLink;
  };

  const renderEnrollmentAction = () => {
    if (isFull) {
      return (
        <Button
          className={moduleStyles.fullWidthButton}
          size="m"
          disabled
          text="Workshop is full"
          onClick={() => null}
        />
      );
    }

    if (custom_registration_link) {
      return (
        <>
          <BodyThreeText>
            This workshop’s registration is managed externally by the regional
            partner.
          </BodyThreeText>
          <LinkButton
            href={buildEnrollButtonLink(custom_registration_link)}
            className={moduleStyles.fullWidthButton}
            type="primary"
            size="m"
            text="Go to partner enrollment"
            iconRight={{iconName: 'up-right-from-square'}}
          />
        </>
      );
    }

    if (is_student || is_signed_out) {
      return (
        <LinkButton
          className={moduleStyles.fullWidthButton}
          type="primary"
          size="m"
          href={buildEnrollButtonLink(`/professional-learning/workshops/${id}`)}
          text="Sign-in to enroll"
          iconRight={{iconName: 'right-to-bracket'}}
        />
      );
    }

    return (
      <Button
        className={moduleStyles.fullWidthButton}
        type="primary"
        size="m"
        isPending={isSubmitting}
        onClick={handleClick}
        text="Enroll in this workshop"
      />
    );
  };

  const showAlert = alertState.show || !!error;
  return (
    <div className={moduleStyles.card}>
      <Heading3 visualAppearance="heading-xs">Enroll in this workshop</Heading3>
      {showAlert && (
        <Alert
          type={'danger'}
          text={alertState.text || (error as string)}
          link={alertState.link}
          onClose={() =>
            setAlertState({show: false, text: '', link: undefined})
          }
        />
      )}
      {renderEnrollmentAction()}
      <Link type="secondary" size="xs" href="#data-sharing-notice">
        Click to see data sharing notice
      </Link>
    </div>
  );
};

export default EnrollInWorkshop;
