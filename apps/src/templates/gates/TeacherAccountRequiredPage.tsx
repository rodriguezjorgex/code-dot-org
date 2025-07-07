import React, {useEffect} from 'react';

import {queryParams} from '@cdo/apps/code-studio/utils';
import {EVENTS, PLATFORMS} from '@cdo/apps/metrics/AnalyticsConstants';
import analyticsReporter from '@cdo/apps/metrics/AnalyticsReporter';
import AccountBanner from '@cdo/apps/templates/account/AccountBanner';
import AccountCard from '@cdo/apps/templates/account/AccountCard';
import {navigateToHref} from '@cdo/apps/utils';
import i18n from '@cdo/locale';

import styles from './gate-pages.module.scss';

const TeacherAccountRequiredPage: React.FunctionComponent = () => {
  const sourcePage = queryParams('source_page');

  const returnToUrlParam = queryParams('return_to');
  const returnTo = returnToUrlParam
    ? `?user_return_to=${returnToUrlParam}`
    : '';

  useEffect(() => {
    analyticsReporter.sendEvent(
      EVENTS.UPGRADE_TO_TEACHER_ACCOUNT_PAGE_VISITED_EVENT,
      {source: sourcePage},
      PLATFORMS.BOTH
    );
  }, [sourcePage]);

  const handleUpdateToTeacherAccount = () => {
    sessionStorage.setItem(
      'accountSettingsToUpdate',
      JSON.stringify(['accountInformation'])
    );
    navigateToHref(`/users/edit${returnTo}#change-user-type-modal-form`);
  };

  return (
    <main>
      <div className={styles.contentContainer}>
        <AccountBanner
          heading={i18n.accountNeedTeacherAccountWelcomeBannerHeaderLabel()}
          desc={i18n.accountNeedTeacherAccountWelcomeBannerHeaderDescGeneric()}
          showLogo={true}
        />
        <div className={styles.cardContainer}>
          <AccountCard
            id={'keep-student-account-card'}
            icon={'child'}
            title={i18n.accountKeepStudentAccountCardTitle()}
            content={i18n.accountKeepStudentAccountCardContentGeneric()}
            buttonText={i18n.accountKeepStudentAccountCardButton()}
            buttonType="secondary"
            href="/home"
          />
          <AccountCard
            id={'switch-to-teacher-account-card'}
            icon={'chalkboard-user'}
            title={i18n.accountSwitchTeacherAccountCardTitle()}
            content={i18n.accountSwitchTeacherAccountCardContentGeneric()}
            buttonText={i18n.accountSwitchTeacherAccountCardButton()}
            buttonType="primary"
            onClick={handleUpdateToTeacherAccount}
          />
        </div>
      </div>
    </main>
  );
};

export default TeacherAccountRequiredPage;
