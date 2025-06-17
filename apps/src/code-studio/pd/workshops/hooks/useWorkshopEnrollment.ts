import {useState} from 'react';

import {SUBMISSION_STATUSES} from '@cdo/apps/code-studio/pd/workshop_enrollment/constants';
import {WorkshopEnrollmentParams} from '@cdo/apps/code-studio/pd/workshops/types';
import {getAuthenticityToken} from '@cdo/apps/util/AuthenticityTokenStore';

export type WorkshopEnrollmentResponse = {
  workshop_enrollment_status: string;
  error_message?: string;
  cancel_url?: string;
};

export function useWorkshopEnrollment(workshopId: number) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEnrollment = async (
    params: WorkshopEnrollmentParams | null
  ): Promise<WorkshopEnrollmentResponse | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/v1/pd/workshops/${workshopId}/enrollments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': await getAuthenticityToken(),
          },
          body: JSON.stringify(params),
        }
      );

      const result = await response.json();
      setIsSubmitting(false);

      if (
        result.workshop_enrollment_status === SUBMISSION_STATUSES.UNKNOWN_ERROR
      ) {
        setError(result.error_message || 'Unknown error occurred');
        return null;
      }

      return result;
    } catch (e) {
      setIsSubmitting(false);
      setError('Unknown error occurred');
      return null;
    }
  };

  return {submitEnrollment, isSubmitting, error};
}
