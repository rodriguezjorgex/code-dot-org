import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import WorkshopLinks from '@cdo/apps/code-studio/pd/workshop_dashboard/WorkshopLinks';

describe('WorkshopLinks', () => {
  const renderDefault = (hasCustomRegistrationLink: boolean) => {
    render(
      <WorkshopLinks
        workshopId={1}
        hasCustomRegistrationLink={hasCustomRegistrationLink}
      />
    );
  };

  it('renders only single column if workshop does not have custom registration link', () => {
    renderDefault(false);

    screen.getByText('Your Workshop Links');
    screen.getByText('Marketing Page');
    screen.getByText(`${window.location.origin}/profession...`);
    expect(screen.getAllByText('Copy link').length).toBe(1);
  });

  it('renders both columns if workshop has custom registration link', () => {
    renderDefault(true);

    screen.getByText('Your Workshop Links');
    screen.getByText('Marketing Page');
    screen.getByText('Join Workshop Page');
    screen.getByText(`${window.location.origin}/profession...`);
    screen.getByText(`${window.location.origin}/pd/worksho...`);
    expect(screen.getAllByText('Copy link').length).toBe(2);
  });
});
