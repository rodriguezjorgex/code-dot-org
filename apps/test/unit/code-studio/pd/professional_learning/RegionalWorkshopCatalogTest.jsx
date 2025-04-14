import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import RegionalWorkshopCatalog from '@cdo/apps/code-studio/pd/professional_learning/RegionalWorkshopCatalog';

jest.mock('@cdo/apps/util/AuthenticityTokenStore', () => ({
  getAuthenticityToken: jest.fn().mockResolvedValue('authToken'),
}));

const TEST_WORKSHOP = {
  id: 1,
  name: 'Regional Seattle Workshop',
  course: 'Test Course 1',
  subject: 'Test Subject',
  dates: '1/1/2000',
  location: 'Address 111',
  sessions: [],
  location_name: '111',
  location_address: 'Address 111',
  on_map: false,
  funded: false,
  virtual: false,
  enrolled_teacher_count: 0,
  capacity: 1,
  facilitators: ['Mx. Facilitator'],
  organizer: {name: 'Mx. Organizer'},
  enrollment_code: 'ABCD',
  status: 'Not Started',
};

describe('RegionalWorkshopCatalog', () => {
  it('page defaults to telling the user they need to enter a zip code', () => {
    render(<RegionalWorkshopCatalog />);

    screen.getByText('Find your local workshop and apply');
    screen.getByText('Enter zip code to see workshops');

    // No regional partner retrieved with an empty zip
    screen.getByText('Zip code required');
  });

  it('shows no workshop display when entered zip code yields no workshops', async () => {
    const zip = '11111';
    const fetchStub = jest.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          regional_workshop_data: {regional_partner: '', workshops: []},
        }),
    });
    render(<RegionalWorkshopCatalog />);

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: {value: '11111'},
    });
    fireEvent.click(screen.getAllByRole('button')[0]);

    await waitFor(() => {
      screen.getByText('Find your local workshop and apply');
      screen.getByText('No workshops found');

      // No regional partner found in this zip
      screen.getByText('No regional partner found');

      expect(fetchStub).toHaveBeenCalledWith(
        `/dashboardapi/v1/pd/regional_workshop_data/${zip}`
      );
      fetchStub.mockRestore();
    });
  });
});
