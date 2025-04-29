import {LinkButton, buttonColors} from '@code-dot-org/component-library/button';
import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import Tags from '@code-dot-org/component-library/tags';
import {
  BodyOneText,
  BodyTwoText,
  OverlineTwoText,
} from '@code-dot-org/component-library/typography';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import style from './regionalWorkshopCatalog.module.scss';

const RegionalWorkshopCatalogCard = ({
  id,
  course,
  subject,
  name,
  capacity,
  numEnrollments,
  sessionTimes,
  format,
  locationName,
  fee,
  hasPrereq,
  requiresApplication,
  registrationLink,
}) => {
  const seatsRemaining = capacity - numEnrollments;
  const isFull = seatsRemaining <= 0;
  const workshopTitle = name ? name : `${course}: ${subject}`;
  const workshopSessionsText =
    sessionTimes.length > 1
      ? `${sessionTimes[0]} + ${sessionTimes.length - 1} More`
      : sessionTimes[0];
  const prereqText = hasPrereq ? 'Has prerequisites' : 'No prerequisites';

  return (
    <div className={style.workshopCatalogCard}>
      <div className={style.workshopContent}>
        <div className={style.titleBlock}>
          <Tags
            tagsList={[
              {
                label: isFull ? 'Full' : `${seatsRemaining} Seats Remaining`,
                icon: {
                  iconName: isFull ? 'users' : 'user-plus',
                  iconStyle: 'solid',
                  placement: 'left',
                },
              },
            ]}
            size="s"
            className={classNames(
              style.capacityTag,
              isFull ? style.fullCapacityTag : style.spotsOpenCapacityTag
            )}
          />
          <BodyOneText className={style.wsTitle}>{workshopTitle}</BodyOneText>
          <OverlineTwoText className={style.gradeNote}>
            FOR TEACHERS OF GRADES:
          </OverlineTwoText>
          <p>1, 2, 3, 4, 5</p>
        </div>
        <div className={style.infoBlock}>
          <span className={style.infoLine}>
            <div className={style.infoLineIconContainer}>
              <FontAwesomeV6Icon iconName={'calendar'} />
            </div>
            <BodyTwoText>{workshopSessionsText}</BodyTwoText>
          </span>
          <span className={style.infoLine}>
            <div className={style.infoLineIconContainer}>
              <FontAwesomeV6Icon iconName={'screen-users'} />
            </div>
            <BodyTwoText>{`${format} workshop`}</BodyTwoText>
          </span>
          {locationName && (
            <span className={style.infoLine}>
              <div className={style.infoLineIconContainer}>
                <FontAwesomeV6Icon iconName={'building'} />
              </div>
              <BodyTwoText>{locationName}</BodyTwoText>
            </span>
          )}
          <span className={style.infoLine}>
            <div className={style.infoLineIconContainer}>
              <FontAwesomeV6Icon iconName={'dollar-circle'} />
            </div>
            <BodyTwoText>{fee ? fee : 'Free'}</BodyTwoText>
          </span>
          <span className={style.infoLine}>
            <div className={style.infoLineIconContainer}>
              <FontAwesomeV6Icon iconName={'arrow-up-wide-short'} />
            </div>
            <BodyTwoText>{prereqText}</BodyTwoText>
          </span>
        </div>
      </div>
      <div className={style.buttonContainer}>
        <LinkButton
          text="Learn more"
          type="secondary"
          target="_blank"
          color={buttonColors.black}
          href={'#'}
          className={style.wsCardButton}
        />
        {requiresApplication ? (
          <LinkButton
            text="Apply now"
            target="_blank"
            color="purple"
            href={'#'}
            className={style.wsCardButton}
            disabled={isFull}
          />
        ) : (
          <LinkButton
            text="Enroll now"
            target="_blank"
            color="purple"
            iconRight={
              registrationLink ? {iconName: 'up-right-from-square'} : null
            }
            href={registrationLink ? registrationLink : '#'}
            className={style.wsCardButton}
            disabled={isFull}
          />
        )}
      </div>
    </div>
  );
};

RegionalWorkshopCatalogCard.propTypes = {
  id: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  subject: PropTypes.string,
  name: PropTypes.string,
  capacity: PropTypes.number.isRequired,
  numEnrollments: PropTypes.number.isRequired,
  sessionTimes: PropTypes.arrayOf(PropTypes.string).isRequired,
  format: PropTypes.string.isRequired,
  locationName: PropTypes.string,
  fee: PropTypes.string,
  hasPrereq: PropTypes.bool.isRequired,
  requiresApplication: PropTypes.bool.isRequired,
  registrationLink: PropTypes.string,
};

export default RegionalWorkshopCatalogCard;
