import {Button, LinkButton} from '@code-dot-org/component-library/button';
import Modal from '@code-dot-org/component-library/modal';
import TextField from '@code-dot-org/component-library/textField';
import {
  Heading1,
  Heading2,
  BodyTwoText,
  OverlineTwoText,
} from '@code-dot-org/component-library/typography';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import style from './workshopMarketingPage.module.scss';

export default function WorkshopMarketingPage({workshopInfo}) {
  return Object.keys(workshopInfo).forEach(key => (
    <p>
      {key}: {JSON.stringify(workshopInfo.key)}
    </p>
  ));
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
