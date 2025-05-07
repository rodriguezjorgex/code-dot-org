import {BodyFourText} from '@code-dot-org/component-library/typography';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import style from './regionalWorkshopCatalog.module.scss';

const ALL_GRADES = [
  'K',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

const GradeLevelsBarDisplay = ({supportedGradeLevels}) => {
  const getGradeBoxStyles = grade => {
    let styles = [style.gradeBox];

    if (grade === 'K') {
      styles.push(style.kindergartenGradeBox);
    } else if (grade === '12') {
      styles.push(style.twelfthGradeBox);
    }

    if (supportedGradeLevels.includes(grade)) {
      styles.push(style.supportedGradeBox);
      if (grade !== 'K') {
        const previousGrade = ALL_GRADES[ALL_GRADES.indexOf(grade) - 1];
        if (!supportedGradeLevels.includes(previousGrade)) {
          styles.push(style.gradeLevelDivider);
        }
      }
    } else {
      styles.push(style.unsupportedGradeBox);
      if (grade !== 'K') {
        styles.push(style.gradeLevelDivider);
      }
    }

    return classNames(...styles);
  };

  return (
    <div className={style.gradeBar}>
      {ALL_GRADES.map(grade => (
        <div key={`grade-${grade}`} className={getGradeBoxStyles(grade)}>
          <BodyFourText>{grade}</BodyFourText>
        </div>
      ))}
    </div>
  );
};

GradeLevelsBarDisplay.propTypes = {
  supportedGradeLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default GradeLevelsBarDisplay;
