import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import {
  BodyThreeText,
  BodyFourText,
  StrongText,
} from '@code-dot-org/component-library/typography';
import React from 'react';

import {GetWorkshopInfoScriptDataResponse, SessionInfo} from './../types';

import moduleStyles from './workshopSessionsList.module.scss';

const renderSessionsListItem = (session: SessionInfo) => {
  const startDate = new Date(session.start);
  const endDate = new Date(session.end);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const dateLabel = dateFormatter.format(startDate);
  const timeRange = `${timeFormatter.format(
    startDate
  )} – ${timeFormatter.format(endDate)}`;

  const isVirtual = !!session.meeting_link;

  const locationLabel = isVirtual
    ? 'Virtual / Zoom'
    : session.location_name
    ? `${session.location_name}`
    : 'TBD';

  return (
    <li key={session.id}>
      <div className={moduleStyles.sessionItemTime}>
        <BodyThreeText>
          <StrongText>{dateLabel}</StrongText>
        </BodyThreeText>
        <BodyFourText>{timeRange}</BodyFourText>
      </div>
      <div className={moduleStyles.sessionItemLocation}>
        <FontAwesomeV6Icon iconName={isVirtual ? 'video' : 'location-dot'} />
        <BodyThreeText>{locationLabel}</BodyThreeText>
      </div>
    </li>
  );
};
interface WorkshopSessionsListProps
  extends Pick<GetWorkshopInfoScriptDataResponse, 'sessions'> {}

/** Component to render a list of workshop sessions. */
const WorkshopSessionsList: React.FC<WorkshopSessionsListProps> = ({
  sessions,
}) => {
  return (
    <ul className={moduleStyles.workshopSessionsList}>
      {sessions.map(session => renderSessionsListItem(session))}
    </ul>
  );
};

export default WorkshopSessionsList;
