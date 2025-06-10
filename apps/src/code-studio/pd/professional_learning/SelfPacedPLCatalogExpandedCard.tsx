import {
  Button,
  LinkButton,
  buttonColors,
} from '@code-dot-org/component-library/button';
import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import {
  Heading3,
  BodyTwoText,
} from '@code-dot-org/component-library/typography';
import React from 'react';

import i18n from '@cdo/locale';

import {SelfPacedPLCourseInfo} from './SelfPacedPLCatalog';

import style from './selfPacedPLCatalog.module.scss';

interface SelfPacedPLExpandedCard extends SelfPacedPLCourseInfo {
  onClose: () => void;
}

const SelfPacedPLCatalogExpandedCard: React.FunctionComponent<
  SelfPacedPLExpandedCard
> = ({
  key,
  display_name,
  grade_levels,
  duration,
  image,
  cs_topic,
  description,
  video,
  course_version_path,
  onClose,
}) => {
  return (
    <div id={`${key}ExpandedCardContainer`}>
      <div className={style.arrowContainer} />
      <div className={style.centerExpandedCard}>
        <div className={style.expandedCardContainer}>
          <div className={style.flexDivider}>
            <div className={style.plCourseOfferingContainer}>
              <Heading3>{display_name}</Heading3>
              <div className={style.infoContainer}>
                <div className={style.iconWithDescription}>
                  <FontAwesomeV6Icon
                    iconName="user"
                    iconStyle="solid"
                    className="fa-solid"
                  />
                  <BodyTwoText>{grade_levels}</BodyTwoText>
                </div>
                <div className={style.iconWithDescription}>
                  <FontAwesomeV6Icon
                    iconName="clock"
                    iconStyle="solid"
                    className="fa-solid"
                  />
                  <BodyTwoText>{duration}</BodyTwoText>
                </div>
                <div className={style.iconWithDescription}>
                  <FontAwesomeV6Icon
                    iconName="book"
                    iconStyle="solid"
                    className="fa-solid"
                  />
                  <BodyTwoText>{i18n.topic() + ': ' + cs_topic}</BodyTwoText>
                </div>
              </div>
              <hr className={style.horizontalDivider} />
              <div className={style.centerContentContainer}>
                <div className={style.descriptionContentContainer}>
                  <div className={style.descriptionContainer}>
                    <BodyTwoText>{description}</BodyTwoText>
                  </div>
                  <div className={style.mediaContainer}>
                    {video ? (
                      <div className={style.videoContainer}>
                        <iframe
                          width="100%"
                          height="100%"
                          style={{border: 'none'}}
                          src={video}
                          title="Youtube embed"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className={style.imageContainer}>
                        <img src={image} alt="" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <hr className={style.horizontalDivider} />
              <div className={style.buttonsContainer}>
                <LinkButton
                  color={buttonColors.black}
                  type="secondary"
                  href={course_version_path}
                  text={i18n.seeCurriculumDetails()}
                  className={style.buttonFlex}
                  ariaLabel={i18n.quickViewDescription({
                    course_name: display_name,
                  })}
                />
              </div>
            </div>
            <div className={style.sideBar}>
              <div className={style.closeButtonContainer}>
                <Button
                  onClick={onClose}
                  icon={{
                    iconName: 'xmark',
                    iconStyle: 'solid',
                  }}
                  ariaLabel="Close Button"
                  isIconOnly
                  type="tertiary"
                  color={buttonColors.black}
                  className={style.closeButton}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfPacedPLCatalogExpandedCard;
