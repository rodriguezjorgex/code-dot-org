// BubbleChoice
//
// This is a React client for a bubble_choice level.  Note that this is
// only used for levels that use Lab2.  For levels that don't use Lab2,
// they will get an older-style level implemented with a HAML page and some
// non-React JS code.

import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {navigateToLevelId} from '@cdo/apps/code-studio/progressRedux';
import {LabState} from '@cdo/apps/lab2/lab2Redux';
import {
  LabProps,
  BubbleChoiceLevelData,
  BubbleChoiceSublevel,
} from '@cdo/apps/lab2/types';
import {useAppDispatch} from '@cdo/apps/util/reduxHooks';

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

  return (
    <div id="bubble-choice" className={styles.bubbleChoiceContainer}>
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
      {/*
      <Video
        src={levelVideo?.src}
        download={levelVideo?.download}
        thumbnail={levelVideo?.thumbnail}
      >
        <button
          id="standalone-video-continue-button"
          type="button"
          onClick={() => nextButtonPressed()}
          className={styles.buttonNext}
        >
          {standaloneVideoLocale.continue()}
        </button>
      </Video>
      */}
    </div>
  );
};

export default BubbleChoice;
