import React from 'react';
import ReactDOM from 'react-dom';

import SkillsContainer from '@cdo/apps/levelbuilder/skills/SkillsContainer';
import getScriptData from '@cdo/apps/util/getScriptData';

$(document).ready(() => {
  const skillsData = getScriptData('skillsData');
  console.log('skillsData in index.js', skillsData);
  ReactDOM.render(
    <SkillsContainer
      canEditSkills={skillsData.canEditSkills}
      skills={skillsData.skills}
    />,
    document.getElementById('skills')
  );
});
