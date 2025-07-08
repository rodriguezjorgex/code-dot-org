import {hasQueryParam, updateQueryParam} from '@cdo/apps/code-studio/utils';
import {makeEnum} from '@cdo/apps/utils';
import {SectionLoginType} from '@cdo/generated-scripts/sharedConstants';

export const OAuthSectionTypes = makeEnum(
  SectionLoginType.google_classroom,
  SectionLoginType.clever,
  'microsoft_classroom'
);

export const SingleSignOnProviders = {
  google: 'google_oauth2',
  microsoft: 'microsoft_v2_auth',
  clever: 'clever',
  facebook: 'facebook',
  lti_v1: SectionLoginType.lti_v1,
};

export const LmsLoginTypeNames = {
  clever: 'Clever',
  google_classroom: 'Google Classroom',
  canvas: 'Canvas',
  canvas_cloud: 'Canvas',
  canvas_beta_cloud: 'Canvas Beta',
  canvas_test_cloud: 'Canvas Test',
  schoology: 'Schoology',
};

export const LmsLoginInstructionUrls = {
  clever:
    'https://support.code.org/hc/en-us/articles/115002716111-Setting-Up-Sections-with-Clever-Sync',
  google_classroom:
    'https://support.code.org/hc/en-us/articles/115001319312-Setting-Up-Sections-with-Google-Classroom-Sync',
  canvas:
    'https://support.code.org/hc/en-us/articles/23621973451405-Create-and-sync-rosters-with-Canvas',
  schoology:
    'https://support.code.org/hc/en-us/articles/23622036958093-Create-and-sync-rosters-with-Schoology',
};

export const AccountSettingsSectionUrlParams = {
  AccountInformation: 'accountInformation',
  SchoolInformation: 'schoolInformation',
};

// If the URL contains the given param, its removed from the URL since that
// section has just been saved in the Account Settings and no longer needs
// to be tracked. It returns if the user has finished all account updates
// tracked by the URL params (i.e. if none are left).
export function handleUpdateUrlOnSettingsSave(accountSettingsSection) {
  updateQueryParam(accountSettingsSection, undefined, false);

  return !(
    hasQueryParam(AccountSettingsSectionUrlParams.AccountInformation) ||
    hasQueryParam(AccountSettingsSectionUrlParams.SchoolInformation)
  );
}
