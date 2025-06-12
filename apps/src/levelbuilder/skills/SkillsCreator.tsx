import {Button} from '@code-dot-org/component-library/button';
import {TextareaAutosize} from '@mui/material';
import {create} from 'lodash';
import React, {useState} from 'react';
import {createSkill} from './SkillsApi';

const SkillsCreator: React.FC = ({}) => {
  const [skillsText, setSkillsText] = useState('');

  return (
    <div>
      <h2>Add New Skills</h2>
      <TextareaAutosize
        aria-label="minimum height"
        minRows={20}
        placeholder="key, concept, description, evaluation criteria"
        style={{width: 650}}
        onChange={e => setSkillsText(e.target.value)}
      />
      <br />
      <br />
      <Button
        text="Add Skills"
        onClick={() => {
          const skills = skillsText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
              const [key, concept, description, evaluationCriteria] =
                line.split(',');
              return {
                key: key.trim(),
                concept: concept.trim(),
                description: description.trim(),
                evaluationCriteria: evaluationCriteria.trim(),
              };
            });
          console.log('Skills to be added:', skills);
          skills.forEach(skill => {
            createSkill(skill);
          });
          setSkillsText('Check the skills table for your newly added skills.');
        }}
      />
    </div>
  );
};

export default SkillsCreator;
