import React from 'react';

import LevelsSkillsTable from './LevelsSkillsTable';
import SkillsCreator from './SkillsCreator';
import SkillsTable from './SkillsTable';
import {LevelsSkill, SkillsByConcept} from './types';

interface SkillsContainerProps {
  canEditSkills: boolean;
  skills: SkillsByConcept;
  levelsSkills: LevelsSkill[];
}

const SkillsContainer: React.FC<SkillsContainerProps> = ({
  canEditSkills,
  skills,
  levelsSkills,
}) => {
  return (
    <div>
      <h1>Skills</h1>
      {!canEditSkills && (
        <h3>You need levelbuilder permissions to edit Skills.</h3>
      )}
      {canEditSkills && <SkillsCreator skills={skills} />}
      <SkillsTable skills={skills} />
      <LevelsSkillsTable levelsSkills={levelsSkills} />
    </div>
  );
};

export default SkillsContainer;
