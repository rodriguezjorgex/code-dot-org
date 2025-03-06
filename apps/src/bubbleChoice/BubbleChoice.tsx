// BubbleChoice
//
// This is a React client for a bubble_choice level.  Note that this is
// only used for levels that use Lab2.  For levels that don't use Lab2,
// they will get an older-style level implemented with a HAML page and some
// non-React JS code.

import {Button} from '@code-dot-org/component-library/button';
import {Heading4} from '@code-dot-org/component-library/typography';
import React, {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {navigateToLevelId} from '@cdo/apps/code-studio/progressRedux';
import {LabState} from '@cdo/apps/lab2/lab2Redux';
import continueOrFinishLesson from '@cdo/apps/lab2/progress/continueOrFinishLesson';
import {
  LabProps,
  BubbleChoiceLevelData,
  BubbleChoiceSublevel,
} from '@cdo/apps/lab2/types';
import {capitalizeFirstLetter} from '@cdo/apps/util/capitalizeFirstLetter';
import {useAppDispatch, useAppSelector} from '@cdo/apps/util/reduxHooks';

import {getCurrentLesson} from '../code-studio/progressReduxSelectors';
import {commonI18n} from '../types/locale';
//import bubbleChoiceLocale from './locale';

import styles from './BubbleChoice.module.scss';

const BubbleChoice: React.FunctionComponent<LabProps> = () => {
  const dispatch = useAppDispatch();
  const levelData = useSelector(
    (state: {lab: LabState}) => state.lab.levelProperties?.levelData
  );
  const currentAppName = useSelector(
    (state: {lab: LabState}) => state.lab.levelProperties?.appName
  );
  const background = useAppSelector(
    state => getCurrentLesson(state)?.background || null
  );
  const backgroundSuffix = capitalizeFirstLetter(background || 'dark');

  const [levelBubbleChoice, setLevelBubbleChoice] =
    React.useState<BubbleChoiceLevelData | null>(null);

  useEffect(() => {
    if (currentAppName === 'bubble_choice' && levelData) {
      setLevelBubbleChoice(levelData as BubbleChoiceLevelData);
    }
  }, [currentAppName, levelData]);

  const sublevelClicked = (sublevel: BubbleChoiceSublevel) => {
    dispatch(navigateToLevelId(sublevel.level_id));
  };

  const onContinue = useCallback(() => {
    dispatch(continueOrFinishLesson());
  }, [dispatch]);

  return (
    <div id="bubble-choice" className={styles.bubbleChoiceContainer}>
      <div>
        <Heading4 className={styles[`heading${backgroundSuffix}`]}>
          {levelBubbleChoice?.displayName}
        </Heading4>
        <div className={styles[`text${backgroundSuffix}`]}>
          {levelBubbleChoice?.description}
        </div>
      </div>
      <div className={styles.sublevelsContainer}>
        {levelBubbleChoice?.sublevels.map((sublevel, index) => (
          <div
            key={index}
            className={styles.sublevelContainer}
            onClick={() => sublevelClicked(sublevel)}
          >
            <img
              alt=""
              src={sublevel.thumbnail_url}
              className={styles.sublevelImage}
            />
            <div className={styles.sublevelText}>{sublevel.display_name}</div>
          </div>
        ))}
      </div>
      <div className={styles.buttonRow}>
        <Button
          ariaLabel={commonI18n.continue()}
          text={commonI18n.continue()}
          onClick={onContinue}
          className={styles.continueButton}
        />
      </div>
    </div>
  );
};

export default BubbleChoice;
