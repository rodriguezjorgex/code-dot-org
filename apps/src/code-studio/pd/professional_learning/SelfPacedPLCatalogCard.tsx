import {
  Button,
  LinkButton,
  buttonColors,
} from '@code-dot-org/component-library/button';
import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import React from 'react';

import CardLabels from '@cdo/apps/templates/curriculumCatalog/CardLabels';
import i18n from '@cdo/locale';

import {SelfPacedPLCourseInfo} from './SelfPacedPLCatalog';
import SelfPacedPLCatalogExpandedCard from './SelfPacedPLCatalogExpandedCard';

import style from './selfPacedPLCatalog.module.scss';

interface SelfPacedPLCard extends SelfPacedPLCourseInfo {
  isExpanded: boolean;
  updateExpandedCardKey: () => void;
}

const SelfPacedPLCatalogCard: React.FunctionComponent<SelfPacedPLCard> = ({
  key,
  display_name,
  grade_levels,
  duration,
  image,
  cs_topic,
  description,
  video,
  course_version_path,
  isExpanded,
  updateExpandedCardKey,
}) => (
  <div id={`${key}CardContainer`} className={style.cardContainer}>
    <div>
      <img src={image} alt="" />
      <div className={style.curriculumInfoContainer}>
        <div>
          <div className={style.csTopicLabels}>
            <CardLabels subjectsAndTopics={cs_topic.split(',')} />
          </div>
          <h4>{display_name}</h4>
          <div className={style.iconWithDescription}>
            <FontAwesomeV6Icon
              iconName="user"
              iconStyle="solid"
              className="fa-solid"
            />
            <p>{grade_levels}</p>
          </div>
          <div className={style.iconWithDescription}>
            <FontAwesomeV6Icon
              iconName="clock"
              iconStyle="solid"
              className="fa-solid"
            />
            <p>{duration}</p>
          </div>
        </div>
        <div className={style.buttonsContainer}>
          <Button
            onClick={updateExpandedCardKey}
            ariaLabel={i18n.quickViewDescription({
              course_name: display_name,
            })}
            text={i18n.quickView()}
            className={style.buttonFlex}
            type="secondary"
            color={buttonColors.black}
          />
          <LinkButton
            color={buttonColors.black}
            type="secondary"
            href={course_version_path}
            ariaLabel={i18n.learnMoreDescription({
              course_name: display_name,
            })}
            text={i18n.learnMore()}
            className={style.buttonFlex}
          />
        </div>
      </div>
    </div>
    {isExpanded && (
      <SelfPacedPLCatalogExpandedCard
        key={key}
        display_name={display_name}
        duration={duration}
        grade_levels={grade_levels}
        cs_topic={cs_topic}
        description={description}
        image={image}
        video={video}
        course_version_path={course_version_path}
        onClose={updateExpandedCardKey}
      />
    )}
  </div>
);

export default SelfPacedPLCatalogCard;
