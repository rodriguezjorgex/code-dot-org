import {
  Heading1,
  Heading2,
  BodyTwoText,
} from '@code-dot-org/component-library/typography';
import PropTypes from 'prop-types';
import React from 'react';

import style from './workshopMarketingPage.module.scss';

export default function WorkshopMarketingPage({workshopInfo}) {
  return (
    <div className={style.workshopCatalog}>
      <section className={style.headerContainer}>
        <Heading1>Register for a workshop</Heading1>
      </section>
      <section className={style.bodyContainer}>
        <div className={style.workshopInfoContainer}>
          <Heading2>Sample workshop title</Heading2>
          <BodyTwoText>Course: {workshopInfo.course}</BodyTwoText>
          <BodyTwoText>Subject: {workshopInfo.subject}</BodyTwoText>
          <BodyTwoText>
            PL Topics (course offerings): {workshopInfo.course_offerings}
          </BodyTwoText>
          <BodyTwoText>Name: {workshopInfo.name}</BodyTwoText>
          <BodyTwoText>Capacity: {workshopInfo.capacity}</BodyTwoText>
          <BodyTwoText>
            Current # of enrollments: {workshopInfo.num_enrollments}
          </BodyTwoText>
          <BodyTwoText>Grade levels: {workshopInfo.grade_levels}</BodyTwoText>
          <BodyTwoText>Sessions:</BodyTwoText>
          {workshopInfo.sessions.map(session => (
            <ul>
              <li>Id: {session.id}</li>
              <li>Start: {session.start}</li>
              <li>End: {session.end}</li>
              <li>Format: {session.format}</li>
              <li>Is local: {session.is_local}</li>
              <li>Location name: {session.location_name}</li>
              <li>Location address: {session.location_address}</li>
              <li>Meeting link: {session.meeting_link}</li>
              <li>Location name: {session.location_name}</li>
            </ul>
          ))}
          <BodyTwoText>Format: {workshopInfo.format}</BodyTwoText>
          <BodyTwoText>Location name: {workshopInfo.location_name}</BodyTwoText>
          <BodyTwoText>Fee: {workshopInfo.fee}</BodyTwoText>
          <BodyTwoText>Pre-requisites: {workshopInfo.prereq}</BodyTwoText>
          <BodyTwoText>Description: {workshopInfo.description}</BodyTwoText>
          <BodyTwoText>Notes: {workshopInfo.notes}</BodyTwoText>
          <BodyTwoText>
            Custom registration link: {workshopInfo.custom_registration_link}
          </BodyTwoText>
          <BodyTwoText>
            Regional Partner name: {workshopInfo.regional_partner_name}
          </BodyTwoText>
          <BodyTwoText>Organizer info:</BodyTwoText>
          <ul>
            <li>Name: {workshopInfo.organizer?.name}</li>
            <li>Email: {workshopInfo.organizer?.email}</li>
          </ul>
          <BodyTwoText>Facilitators:</BodyTwoText>
          {workshopInfo.facilitators.map(facilitator => (
            <ul>
              <li>Name: {facilitator.name}</li>
              <li>Email: {facilitator.email}</li>
              <li>Bio: {facilitator.bio}</li>
            </ul>
          ))}
        </div>
      </section>
    </div>
  );
}

WorkshopMarketingPage.propTypes = {
  workshopInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    course: PropTypes.string.isRequired,
    subject: PropTypes.string,
    course_offerings: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    capacity: PropTypes.number.isRequired,
    num_enrollments: PropTypes.number.isRequired,
    grade_levels: PropTypes.arrayOf(PropTypes.string),
    sessions: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        location_name: PropTypes.string,
        is_local: PropTypes.bool.isRequired,
      })
    ).isRequired,
    format: PropTypes.string.isRequired,
    location_name: PropTypes.string,
    fee: PropTypes.string,
    prereq: PropTypes.string,
    description: PropTypes.string,
    notes: PropTypes.string,
    custom_registration_link: PropTypes.string,
    regional_partner_name: PropTypes.string,
    organizer: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }).isRequired,
    facilitators: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        bio: PropTypes.string,
      })
    ),
  }),
};
