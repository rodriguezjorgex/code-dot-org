import Breadcrumbs from '@code-dot-org/component-library/breadcrumbs';
import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import {LinkWithText} from '@code-dot-org/component-library/link';
import Tags from '@code-dot-org/component-library/tags';
import {
  Heading1,
  Heading2,
  Heading3,
  BodyTwoText,
  BodyThreeText,
  StrongText,
} from '@code-dot-org/component-library/typography';
import React from 'react';

import {DATA_SHARING_NOTICE} from './../constants';
import EnrollInWorkshop from './components/EnrollInWorkshop';
import OrganizerInformation from './components/OrganizerInformation';
import {FacilitatorInfo, OrganizerInfo} from './types';

import moduleStyles from './workshopMarketingPage.module.scss';

interface SessionInfo {
  id: number;
  start: string;
  end: string;
  is_local: boolean;
  location_name?: string;
  location_address?: string;
  meeting_link?: string;
  session_format: string;
}

const workshopMarketingBreadcrumbs: LinkWithText[] = [
  {
    text: 'Explore workshops',
    href: '/pd/workshop_dashboard/workshops/',
  },
  {
    text: 'Workshop information',
    href: '/pd/workshops/1',
  },
];

const formatSession = (s: SessionInfo) =>
  `${new Date(s.start).toLocaleDateString()} • ${
    s.location_name || s.meeting_link || 'TBD'
  }`;

const WorkshopMarketingPage: React.FunctionComponent<{
  id: number;
  course: string;
  subject?: string;
  course_offerings?: string[];
  name?: string;
  capacity: number;
  num_enrollments: number;
  grade_levels?: string[];
  sessions: SessionInfo[];
  format: string;
  location_name?: string;
  fee?: string;
  prereq?: string;
  description?: string;
  notes?: string;
  custom_registration_link?: string;
  regional_partner_name?: string;
  organizer: OrganizerInfo;
  facilitators?: FacilitatorInfo[];
}> = ({
  // id,
  // course,
  // subject,
  course_offerings,
  name,
  // capacity,
  // num_enrollments,
  grade_levels,
  sessions,
  // format,
  // location_name,
  fee,
  prereq,
  description,
  notes,
  custom_registration_link,
  regional_partner_name,
  organizer,
  facilitators,
}) => {
  return (
    <div className={moduleStyles.workshopCatalog}>
      <section className={moduleStyles.header}>
        <Breadcrumbs
          name="workShopMarketingPage-HeaderBreadcrumbs"
          size="l"
          showHomeIcon={true}
          breadcrumbs={workshopMarketingBreadcrumbs}
        />
        <Heading1>Register for a workshop</Heading1>
      </section>
      <div className={moduleStyles.bodyWrapper}>
        <div className={moduleStyles.bodyContainer}>
          <section className={moduleStyles.workshopDetails}>
            <section className={moduleStyles.workshopDetailsItem}>
              <Heading2>{name}</Heading2>
              <div className={moduleStyles.workshopUnderHeadingDetails}>
                <BodyTwoText className={moduleStyles.gradeLevels}>
                  <FontAwesomeV6Icon iconName="users" />
                  <StrongText>Grades:</StrongText> {grade_levels?.join(', ')}
                </BodyTwoText>
                {prereq && (
                  <BodyTwoText className={moduleStyles.prerequisites}>
                    <FontAwesomeV6Icon iconName="arrow-up-wide-short" />
                    <StrongText>Prerequisites:</StrongText> {prereq}
                  </BodyTwoText>
                )}
                <BodyTwoText className={moduleStyles.fee}>
                  <FontAwesomeV6Icon iconName="dollar-circle" />
                  <StrongText>Cost:</StrongText>{' '}
                  {!fee || fee === '0' ? 'Free' : `$${fee}`}
                </BodyTwoText>
              </div>
            </section>

            <hr />

            <section className={moduleStyles.workshopDetailsItem}>
              <Heading3 visualAppearance={'heading-xs'}>
                Sessions in This Workshop
              </Heading3>
              <ul className={moduleStyles.workshopSessionsList}>
                {sessions.map(session => (
                  <li
                    key={session.id}
                    className={moduleStyles.workshopSessionItem}
                  >
                    <BodyTwoText>{formatSession(session)}</BodyTwoText>
                  </li>
                ))}
              </ul>
            </section>

            <section className={moduleStyles.workshopDetailsItem}>
              <Heading3 visualAppearance={'heading-xs'}>Description:</Heading3>
              <BodyTwoText>{description}</BodyTwoText>
            </section>

            <section className={moduleStyles.workshopDetailsItem}>
              <Heading3 visualAppearance={'heading-xs'}>
                Attendee Notes:
              </Heading3>
              <BodyTwoText>{notes}</BodyTwoText>
            </section>

            {course_offerings && course_offerings.length > 0 && (
              <section className={moduleStyles.workshopDetailsItem}>
                <Heading3 visualAppearance="heading-xs">
                  PL Topics Covered:
                </Heading3>
                <Tags
                  size="s"
                  className={moduleStyles.plTopicsTags}
                  tagsList={course_offerings.map(course => ({label: course}))}
                />
              </section>
            )}

            <section className={moduleStyles.workshopDetailsItem}>
              <Heading3 visualAppearance="heading-xs">
                Workshop Facilitators
              </Heading3>
              <div className={moduleStyles.workshopFacilitatorsList}>
                {facilitators?.map(facilitator => (
                  <div
                    key={facilitator.email}
                    className={moduleStyles.workshopFacilitatorItem}
                  >
                    <strong>{facilitator.name}</strong>
                    <BodyTwoText>{facilitator.email}</BodyTwoText>
                    {facilitator.bio && (
                      <BodyTwoText>{facilitator.bio}</BodyTwoText>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className={moduleStyles.workshopDetailsItem}>
              <Heading3 visualAppearance="heading-xs">
                Data Sharing Notice
              </Heading3>
              <BodyThreeText>{DATA_SHARING_NOTICE}</BodyThreeText>
            </section>
          </section>

          <aside className={moduleStyles.sidebar}>
            <EnrollInWorkshop
              custom_registration_link={custom_registration_link}
            />

            <OrganizerInformation
              organizer={organizer}
              regional_partner_name={regional_partner_name}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default WorkshopMarketingPage;
