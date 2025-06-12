/**
 * New workshop enrollment page
 */
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import {EVENTS, PLATFORMS} from '@cdo/apps/metrics/AnalyticsConstants';
import analyticsReporter from '@cdo/apps/metrics/AnalyticsReporter';
import {navigateToHref} from '@cdo/apps/utils';

import {SUBMISSION_STATUSES} from './constants';

export default function WorkshopJoin({workshopEnrollmentStatus, userInfo}) {
  const [enrollmentStatus, setEnrollmentStatus] = useState(
    workshopEnrollmentStatus
  );

  const onSubmissionComplete = result => {
    setEnrollmentStatus(
      result
        ? result.workshop_enrollment_status
        : SUBMISSION_STATUSES.UNKNOWN_ERROR
    );
  };

  const RenderJoinWorkshopContent = () => {
    switch (this.state.workshopEnrollmentStatus) {
      case SUBMISSION_STATUSES.DUPLICATE:
        return this.renderDuplicate();
      case SUBMISSION_STATUSES.OWN:
        return this.renderOwn();
      case SUBMISSION_STATUSES.CLOSED:
        return this.renderClosed();
      case SUBMISSION_STATUSES.FULL:
        return this.renderFull();
      case SUBMISSION_STATUSES.NOT_FOUND:
        return this.renderNotFound();
      case SUBMISSION_STATUSES.SUCCESS:
        return this.renderSuccess();
    }
  };

  return <div>{RenderJoinWorkshopContent()}</div>;
}

WorkshopJoin.propTypes = {
  workshopEnrollmentStatus: PropTypes.string.isRequired,
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    schoolName: PropTypes.string,
  }).isRequired,
};
