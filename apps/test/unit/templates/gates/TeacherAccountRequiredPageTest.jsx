import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import {
  setWindowLocation,
  resetWindowLocation,
} from '@cdo/apps/code-studio/utils';
import TeacherAccountRequiredPage from '@cdo/apps/templates/gates/TeacherAccountRequiredPage';
import i18n from '@cdo/locale';

const TEST_RETURN_TO_HREF = '/test/returnto/href';

describe('TeacherAccountRequiredPage', () => {
  afterEach(() => {
    resetWindowLocation();
  });

  it('renders page with links to the homepage and the provided edit account link', async () => {
    setWindowLocation({
      search: `?return_to=${TEST_RETURN_TO_HREF}&source_page=${encodeURIComponent(
        'workshop enroll'
      )}`,
    });
    render(<TeacherAccountRequiredPage />);

    screen.getByText(i18n.accountNeedTeacherAccountWelcomeBannerHeaderLabel());
    expect(
      screen.getByRole('link', {
        name: i18n.accountKeepStudentAccountCardButton(),
      })
    ).toHaveAttribute('href', '/home');

    fireEvent.click(
      screen.getByText(i18n.accountSwitchTeacherAccountCardButton())
    );
  });
});
