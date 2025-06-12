import React from 'react';

import SkillsTable from './SkillsTable';
import {SkillsByConcept} from './types';
import SkillsCreator from './SkillsCreator';

interface SkillsContainerProps {
  canEditSkills: boolean;
  skills: SkillsByConcept;
}

const SkillsContainer: React.FC<SkillsContainerProps> = ({
  canEditSkills,
  skills,
}) => {
  return (
    <div>
      <h1>Skills</h1>
      {!canEditSkills && (
        <h3>You need levelbuilder permissions to edit Skills.</h3>
      )}
      <SkillsTable skills={skills} />
      {canEditSkills && <SkillsCreator />}
    </div>
  );
};

export default SkillsContainer;
