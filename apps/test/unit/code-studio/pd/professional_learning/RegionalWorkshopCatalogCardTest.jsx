import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import RegionalWorkshopCatalogCard from '@cdo/apps/code-studio/pd/professional_learning/RegionalWorkshopCatalogCard';
import {COURSE_BUILD_YOUR_OWN} from '@cdo/apps/code-studio/pd/workshop_dashboard/workshopConstants';
import {SUBMISSION_STATUSES} from '@cdo/apps/code-studio/pd/workshop_enrollment/constants';
import {navigateToHref} from '@cdo/apps/utils';

jest.mock('@cdo/apps/util/AuthenticityTokenStore', () => ({
  getAuthenticityToken: jest.fn().mockResolvedValue('authToken'),
}));

jest.mock('@cdo/apps/utils', () => ({
  ...jest.requireActual('@cdo/apps/utils'),
  navigateToHref: jest.fn(),
}));

const navigateToHrefMock = navigateToHref;

const TEST_SESSION_1 = {
  id: 1,
  start: '2025-04-22T13:00:00Z',
  end: '2025-04-22T21:00:00Z',
  is_local: false,
};

const TEST_SESSION_2 = {
  id: 2,
  start: '2025-05-01T08:00:00Z',
  end: '2025-05-01T11:00:00Z',
  is_local: false,
};

const DEFAULT_PROPS = {
  id: 1,
  course: 'Test Course 1',
  subject: 'Test Subject',
  name: 'National Test Workshop',
  capacity: 10,
  numEnrollments: 2,
  sessions: [TEST_SESSION_1],
  format: 'In-Person',
  locationName: 'Test University',
  fee: '$400',
  hasPrereq: true,
  requiresApplication: false,
  customApplicationLink: '',
  customRegistrationLink: '',
  userInfo: {
    user_id: 10,
    first_name: 'Firstname',
    last_name: 'Lastname',
    email: 'test@email.com',
  },
  regionalPartnerName: 'Reggie Partner',
};

const renderDefault = (overrideProps = {}) => {
  const props = {...DEFAULT_PROPS, ...overrideProps};
  render(<RegionalWorkshopCatalogCard {...props} />);
};

describe('RegionalWorkshopCatalog', () => {
  it('card states it is full and disables buttons if full', () => {
    renderDefault({capacity: 5, numEnrollments: 5});

    screen.getByText('Full');
    // Cannot find inaccessible elements (i.e. disabled links)
    expect(screen.queryByRole('link', {name: 'learnMore'})).toEqual(null);
    expect(screen.queryByRole('link', {name: 'enrollNow'})).toEqual(null);
  });

  it('card states how many spots are left and enables buttons if not full', () => {
    renderDefault();

    screen.getByText(
      `${DEFAULT_PROPS.capacity - DEFAULT_PROPS.numEnrollments} Seats Remaining`
    );
    expect(screen.getByRole('link', {name: 'learnMore'})).not.toBeDisabled();
    expect(screen.getByRole('link', {name: 'enrollNow'})).not.toBeDisabled();
  });

  it('card shows workshop name when available', () => {
    renderDefault();

    screen.getByText(DEFAULT_PROPS.name);
  });

  it('card shows workshop course and subject when name is not available', () => {
    renderDefault({name: ''});

    screen.getByText(`${DEFAULT_PROPS.course}: ${DEFAULT_PROPS.subject}`);
  });

  it('card lists start datetime of first session for workshop with one session', () => {
    renderDefault();

    screen.getByText('04/22/25 (1:00PM-9:00PM)');
  });

  it('card lists start datetime of first session and how many additional sessions there are for workshop with multiple sessions', () => {
    renderDefault({
      sessions: [TEST_SESSION_1, TEST_SESSION_2],
    });

    screen.getByText('04/22/25 (1:00PM-9:00PM) + 1 More');
  });

  it('card renders button to send user to custom application link if provided and applications are required', () => {
    const customApplicationLink = 'customapplicationlink.com';
    renderDefault({
      requiresApplication: true,
      customApplicationLink: customApplicationLink,
    });

    expect(
      screen.getByRole('link', {
        name: 'applyNow',
      })
    ).toHaveAttribute('href', customApplicationLink);
  });

  it('card renders button to send user to teacher application if applications are required and no custom link is provided', () => {
    renderDefault({requiresApplication: true});

    expect(
      screen.getByRole('link', {
        name: 'applyNow',
      })
    ).toHaveAttribute('href', '/pd/application/teacher');
  });

  it('card renders button to send user to custom registration link if provided and applications are not required', () => {
    const customRegistrationLink = 'customregistrationlink.com';
    renderDefault({customRegistrationLink: customRegistrationLink});

    expect(
      screen.getByRole('link', {
        name: 'enrollNow',
      })
    ).toHaveAttribute('href', customRegistrationLink);
  });

  it('card renders button to send user to workshop registration link if applications are not required and no custom link is provided', () => {
    renderDefault();

    expect(
      screen.getByRole('link', {
        name: 'enrollNow',
      })
    ).toHaveAttribute('href', `/pd/workshops/${DEFAULT_PROPS.id}/enroll`);
  });

  describe('card with button to one-click enroll user for Build Your Own workshops', () => {
    let fetchStub;

    const renderOneClickEnrollDefault = response => {
      fetchStub = jest.spyOn(window, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(response),
      });
      renderDefault({course: COURSE_BUILD_YOUR_OWN, subject: null});
    };

    const checkFetchCalledWithDesiredParams = fetchStub => {
      expect(fetchStub).toHaveBeenCalledWith(
        `/api/v1/pd/workshops/${DEFAULT_PROPS.id}/enrollments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': 'authToken',
          },
          body: JSON.stringify(DEFAULT_PROPS.userInfo),
        }
      );
    };

    afterEach(() => {
      fetchStub.mockRestore();
      sessionStorage.clear();
    });

    it('returns success', async () => {
      renderOneClickEnrollDefault({
        workshop_enrollment_status: SUBMISSION_STATUSES.SUCCESS,
      });

      fireEvent.click(
        screen.getByRole('button', {
          name: 'enrollNow',
        })
      );

      await waitFor(() => {
        expect(sessionStorage.getItem('rpName', false)).toEqual(
          DEFAULT_PROPS.regionalPartnerName
        );
        expect(sessionStorage.getItem('workshopCourse', false)).toEqual(
          COURSE_BUILD_YOUR_OWN
        );
        expect(sessionStorage.getItem('workshopSubject', false)).toEqual('');
        expect(sessionStorage.getItem('workshopName', false)).toEqual(
          DEFAULT_PROPS.name
        );
        expect(sessionStorage.getItem('workshopLocation', false)).toEqual(
          DEFAULT_PROPS.locationName
        );
        expect(sessionStorage.getItem('sessionTimeInfo', false)).toEqual(
          JSON.stringify([TEST_SESSION_1])
        );

        checkFetchCalledWithDesiredParams(fetchStub);
        expect(navigateToHrefMock).toHaveBeenCalledWith(
          '/my-professional-learning'
        );
      });
    });
  });
});
