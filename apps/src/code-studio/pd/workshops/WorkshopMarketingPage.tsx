import Breadcrumbs from '@code-dot-org/component-library/breadcrumbs';
import Button from '@code-dot-org/component-library/button';
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

interface OrganizerInfo {
  name: string;
  email: string;
}

interface FacilitatorInfo {
  name: string;
  email: string;
  bio?: string;
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
      <section className={moduleStyles.headerContainer}>
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
                <StrongText>Cost:</StrongText> {fee || 'Free'}
              </BodyTwoText>
            </div>
            <hr />
            <Heading3 visualAppearance={'heading-xs'}>
              Sessions in This Workshop
            </Heading3>
            <ul>
              {sessions.map(session => (
                <li key={session.id}>
                  <BodyTwoText>{formatSession(session)}</BodyTwoText>
                </li>
              ))}
            </ul>
            <div>
              <Heading3 visualAppearance={'heading-xs'}>Description:</Heading3>
              <BodyTwoText>{description}</BodyTwoText>

              <Heading3 visualAppearance={'heading-xs'}>
                Attendee Notes:
              </Heading3>
              <BodyTwoText>{notes}</BodyTwoText>
            </div>

            {course_offerings && course_offerings.length > 0 && (
              <div>
                <Heading3 visualAppearance="heading-xs">
                  PL Topics Covered:
                </Heading3>
                <Tags
                  size="s"
                  className={moduleStyles.plTopicsTags}
                  tagsList={course_offerings.map(course => ({label: course}))}
                />
              </div>
            )}
            <div>
              <Heading3 visualAppearance="heading-xs">
                Workshop Facilitators
              </Heading3>
              {facilitators?.map(facilitator => (
                <div
                  key={facilitator.email}
                  className={moduleStyles.facilitatorCard}
                >
                  <strong>{facilitator.name}</strong>
                  <BodyTwoText>{facilitator.email}</BodyTwoText>
                  {facilitator.bio && (
                    <BodyTwoText>{facilitator.bio}</BodyTwoText>
                  )}
                </div>
              ))}
            </div>
            <div>
              <Heading3 visualAppearance="heading-xs">
                Data Sharing Notice
              </Heading3>
              <BodyThreeText>{DATA_SHARING_NOTICE}</BodyThreeText>
            </div>
          </section>
          <aside className={moduleStyles.sidebar}>
            <div className={moduleStyles.card}>
              <Heading3 visualAppearance="heading-xs">
                Enroll in this workshop
              </Heading3>
              <BodyThreeText>
                This workshop’s registration is managed externally by the
                regional partner.
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

            <div className={moduleStyles.card}>
              <Heading3 visualAppearance="heading-xs">
                Organizer information
              </Heading3>
              <div className={moduleStyles.underCardHeadingDetails}>
                <BodyThreeText>
                  <FontAwesomeV6Icon iconName="user" />
                  <StrongText>Organizer:</StrongText>
                  {organizer.name}
                </BodyThreeText>
                <BodyThreeText>
                  <FontAwesomeV6Icon iconName="at" />
                  <StrongText>Email: </StrongText>
                  {organizer.email}
                </BodyThreeText>
                <BodyThreeText>
                  <FontAwesomeV6Icon iconName="building" />
                  <StrongText>Regional Partner:</StrongText>
                  {regional_partner_name}
                </BodyThreeText>
                <Button
                  className={moduleStyles.fullWidthButton}
                  type="secondary"
                  color="gray"
                  size="s"
                  onClick={e => e.preventDefault()}
                  text="Contact regional partner"
                />
              </div>
            </div>
          </aside>
        </div>
        {/*/============================/*/}
        {/*<Heading2>Sample workshop title</Heading2>*/}
        {/*<BodyTwoText>Course: {course}</BodyTwoText>*/}
        {/*<BodyTwoText>Subject: {subject}</BodyTwoText>*/}
        {/*<BodyTwoText>*/}
        {/*  PL Topics (course offerings): {course_offerings}*/}
        {/*</BodyTwoText>*/}
        {/*<BodyTwoText>Name: {name}</BodyTwoText>*/}
        {/*<BodyTwoText>Capacity: {capacity}</BodyTwoText>*/}
        {/*<BodyTwoText>Current # of enrollments: {num_enrollments}</BodyTwoText>*/}
        {/*<BodyTwoText>Grade levels: {grade_levels}</BodyTwoText>*/}
        {/*<BodyTwoText>Sessions:</BodyTwoText>*/}
        {/*{sessions.map(session => (*/}
        {/*  <ul>*/}
        {/*    <li>Id: {session.id}</li>*/}
        {/*    <li>Start: {session.start}</li>*/}
        {/*    <li>End: {session.end}</li>*/}
        {/*    <li>Format: {session.session_format}</li>*/}
        {/*    <li>Is local: {session.is_local}</li>*/}
        {/*    <li>Location name: {session.location_name}</li>*/}
        {/*    <li>Location address: {session.location_address}</li>*/}
        {/*    <li>Meeting link: {session.meeting_link}</li>*/}
        {/*  </ul>*/}
        {/*))}*/}
        {/*<BodyTwoText>Format: {format}</BodyTwoText>*/}
        {/*<BodyTwoText>Location name: {location_name}</BodyTwoText>*/}
        {/*<BodyTwoText>Fee: {fee}</BodyTwoText>*/}
        {/*<BodyTwoText>Pre-requisites: {prereq}</BodyTwoText>*/}
        {/*<BodyTwoText>Description: {description}</BodyTwoText>*/}
        {/*<BodyTwoText>Notes: {notes}</BodyTwoText>*/}
        {/*<BodyTwoText>*/}
        {/*  Custom registration link: {custom_registration_link}*/}
        {/*</BodyTwoText>*/}
        {/*<BodyTwoText>*/}
        {/*  Regional Partner name: {regional_partner_name}*/}
        {/*</BodyTwoText>*/}
        {/*<BodyTwoText>Organizer info:</BodyTwoText>*/}
        {/*<ul>*/}
        {/*  <li>Name: {organizer?.name}</li>*/}
        {/*  <li>Email: {organizer?.email}</li>*/}
        {/*</ul>*/}
        {/*<BodyTwoText>Facilitators:</BodyTwoText>*/}
        {/*{facilitators?.map(facilitator => (*/}
        {/*  <ul>*/}
        {/*    <li>Name: {facilitator.name}</li>*/}
        {/*    <li>Email: {facilitator.email}</li>*/}
        {/*    <li>Bio: {facilitator.bio}</li>*/}
        {/*  </ul>*/}
        {/*))}*/}
      </div>
    </div>
  );
};

export default WorkshopMarketingPage;
