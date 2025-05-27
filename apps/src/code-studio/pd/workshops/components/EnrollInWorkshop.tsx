import Button from '@code-dot-org/component-library/button';
import {
  Heading3,
  BodyThreeText,
} from '@code-dot-org/component-library/typography';
import React from 'react';

import moduleStyles from './../workshopMarketingPage.module.scss';

type EnrollInWorkshopProps = {
  custom_registration_link?: string;
};

/** Component to display the enrollment information for a workshop. */
const EnrollInWorkshop: React.FC<EnrollInWorkshopProps> = ({
  custom_registration_link,
}) => {
  return (
    <div className={moduleStyles.card}>
      <Heading3 visualAppearance="heading-xs">Enroll in this workshop</Heading3>
      <BodyThreeText>
        This workshop’s registration is managed externally by the regional
        partner.
      </BodyThreeText>
      {custom_registration_link ? (
        <a href={custom_registration_link} className={moduleStyles.cta}>
          Go to partner enrollment
        </a>
      ) : (
        <Button
          className={moduleStyles.fullWidthButton}
          size="m"
          disabled
          onClick={() => null}
          text="Enrollment Closed"
        />
      )}
      <p>Click to see data sharing notice</p>
    </div>
  );
};

export default EnrollInWorkshop;
