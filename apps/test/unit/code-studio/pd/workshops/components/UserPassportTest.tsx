import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import UserPassport from '@cdo/apps/code-studio/pd/workshops/components/UserPassport';
import {NonSchoolOptions} from '@cdo/generated-scripts/sharedConstants';

const DEFAULT_PROPS = {
  displayName: 'Ms. McEntire',
  givenName: 'Reba',
  familyName: 'McEntire',
  email: 'reba@mcentire.com',
  schoolName: 'Sample School Name',
  schoolType: undefined,
  returnToHref: '/fake-return-url',
  className: '',
};

const renderDefault = (overrideProps = {}) => {
  const props = {...DEFAULT_PROPS, ...overrideProps};
  render(<UserPassport {...props} />);
};

describe('UserPassport', () => {
  it('having all params shows user info', () => {
    renderDefault();

    screen.getByText('Full name');
    screen.getByText(`${DEFAULT_PROPS.givenName} ${DEFAULT_PROPS.familyName}`);
    screen.getByText('Email');
    screen.getByText(DEFAULT_PROPS.email);
    screen.getByText('School');
    screen.getByText(DEFAULT_PROPS.schoolName);
  });

  it('missing name or school shows error messages', () => {
    renderDefault({givenName: '', schoolName: '', schoolType: ''});

    screen.getByText('Full name');
    screen.getByText('Add your full name');
    screen.getByText('School');
    screen.getByText('Add your school');
  });

  it('not teaching in a school setting does not show error message', () => {
    renderDefault({
      schoolName: '',
      schoolType: NonSchoolOptions.NO_SCHOOL_SETTING,
    });

    screen.getByText('School');
    screen.getByText('Non-School Setting');
    expect(screen.queryByText('Add your school')).toBe(null);
  });

  it('edit button saves what sections user needs to edit in sessionStorage: missing full name', async () => {
    renderDefault({givenName: ''});

    fireEvent.click(screen.getByRole('button', {name: 'Edit'}));

    await (() => {
      expect(
        JSON.parse(sessionStorage.getItem('accountSettingsToUpdate') as string)
      ).toBe(['accountInformation']);
    });
  });

  it('edit button saves what sections user needs to edit in sessionStorage: missing school', async () => {
    renderDefault({schoolName: '', schoolType: ''});

    fireEvent.click(screen.getByRole('button', {name: 'Edit'}));

    await (() => {
      expect(
        JSON.parse(sessionStorage.getItem('accountSettingsToUpdate') as string)
      ).toBe(['schoolInformation']);
    });
  });

  it('edit button saves what sections user needs to edit in sessionStorage: missing full name and school', async () => {
    renderDefault({familyName: '', schoolName: '', schoolType: ''});

    fireEvent.click(screen.getByRole('button', {name: 'Edit'}));

    await (() => {
      expect(
        JSON.parse(sessionStorage.getItem('accountSettingsToUpdate') as string)
      ).toBe(['accountInformation', 'schoolInformation']);
    });
  });

  it('edit button does not use sessionStorage if user has all required fields', async () => {
    renderDefault({familyName: '', schoolName: '', schoolType: ''});

    fireEvent.click(screen.getByRole('button', {name: 'Edit'}));

    await (() => {
      expect(sessionStorage.getItem('accountSettingsToUpdate')).toBe(null);
    });
  });
});
