// BubbleChoice
//
// This is a React client for a bubble_choice level.  Note that this is
// only used for levels that use Lab2.  For levels that don't use Lab2,
// they will get an older-style level.

import {Button} from '@code-dot-org/component-library/button';
import {Heading4} from '@code-dot-org/component-library/typography';
import classNames from 'classnames';
import React, {useEffect, useRef} from 'react';

import {navigateToLevelId} from '@cdo/apps/code-studio/progressRedux';
import continueOrFinishLesson from '@cdo/apps/lab2/progress/continueOrFinishLesson';
import {LabProps, BubbleChoiceLevelData} from '@cdo/apps/lab2/types';
import {capitalizeFirstLetter} from '@cdo/apps/util/capitalizeFirstLetter';
import {useAppDispatch, useAppSelector} from '@cdo/apps/util/reduxHooks';

import {getCurrentLesson} from '../code-studio/progressReduxSelectors';
import {commonI18n} from '../types/locale';

import styles from './BubbleChoice.module.scss';

const BubbleChoice: React.FC<LabProps> = ({levelProperties}) => {
  const dispatch = useAppDispatch();
  const background = useAppSelector(
    state => getCurrentLesson(state)?.background || null
  );
  const backgroundSuffix = capitalizeFirstLetter(background || 'dark');
  const levelBubbleChoice = levelProperties.levelData as BubbleChoiceLevelData;

  const [containerWidth, setContainerWidth] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const numSubLevels = levelBubbleChoice?.sublevels.length;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(containerRef.current?.offsetWidth || 0);
      setContainerHeight(containerRef.current?.offsetHeight || 0);
    });
    resizeObserver.observe(containerRef?.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Generate a map of candidate layouts, with each key the number of rows, and each value
  // the corresponding number of columns.  We only store one candidate for each number of
  // rows, and each is the one with the least number of columns that still fit all the sublevels.
  const candidateLayouts = new Map();
  for (let numCols = numSubLevels; numCols >= 1; numCols--) {
    const numRows = Math.ceil(numSubLevels / numCols);
    candidateLayouts.set(numRows, Math.ceil(numSubLevels / numRows));
  }

  // Go through the candidates and find which will deliver the largest sublevel buttons, given
  // the current size of the container.
  let bestSize = -1;
  let bestNumRows = -1;
  for (const [
    candidateLayoutRows,
    candidateLayoutColumns,
  ] of candidateLayouts.entries()) {
    const size = Math.min(
      containerWidth / candidateLayoutColumns,
      containerHeight / candidateLayoutRows
    );
    if (size > bestSize) {
      bestSize = size;
      bestNumRows = candidateLayoutRows;
    }
  }
  const numRows = bestNumRows;
  const numColumns = candidateLayouts.get(bestNumRows);

  return (
    <div id="bubble-choice" className={styles.bubbleChoiceContainer}>
      <div>
        {levelBubbleChoice?.displayName && (
          <Heading4 className={styles[`heading${backgroundSuffix}`]}>
            {levelBubbleChoice?.displayName}
          </Heading4>
        )}
        {levelBubbleChoice?.description && (
          <div className={styles[`text${backgroundSuffix}`]}>
            {levelBubbleChoice?.description}
          </div>
        )}
      </div>
      <div
        className={styles.sublevelsContainer}
        style={{
          gridTemplateColumns: `repeat(${numColumns}, minmax(0,1fr))`,
          gridTemplateRows: `repeat(${numRows}, minmax(0,1fr))`,
        }}
        ref={containerRef}
      >
        {levelBubbleChoice?.sublevels.map((sublevel, index) => (
          <button
            type="button"
            key={index}
            className={classNames(
              styles.sublevelButton,
              styles[`sublevelButton${backgroundSuffix}`]
            )}
            onClick={() => dispatch(navigateToLevelId(sublevel.level_id))}
          >
            <div className={styles.sublevelImageContainer}>
              <img
                alt=""
                src={sublevel.thumbnail_url}
                className={styles.sublevelImage}
              />
            </div>
            <div className={styles.sublevelText}>{sublevel.display_name}</div>
          </button>
        ))}
      </div>
      <div className={styles.buttonRow}>
        <Button
          ariaLabel={commonI18n.continue()}
          text={commonI18n.continue()}
          onClick={() => dispatch(continueOrFinishLesson())}
          className={styles.continueButton}
        />
      </div>
    </div>
  );
};

export default BubbleChoice;
