import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import React from 'react';

import {removeSkillFromLevel} from './SkillsApi';
import './skills.css';

interface Props {
  levelId: number;
  skillId: number;
  skillKey: string;
}

const SkillKeyRow: React.FC<Props> = ({levelId, skillId, skillKey}) => {
  const handleRemoveSkill = () => {
    if (
      window.confirm(
        `Are you sure you want to remove ${skillKey} from level ${levelId}?`
      )
    ) {
      removeSkillFromLevel(levelId, skillId);
    }
  };

  return (
    <div>
      <span>
        {skillKey}{' '}
        <button
          type="button"
          onClick={handleRemoveSkill}
          className="skill-trash-btn"
        >
          <FontAwesomeV6Icon iconName="trash" className="skill-trash-icon" />
        </button>
      </span>
    </div>
  );
};

export default SkillKeyRow;
