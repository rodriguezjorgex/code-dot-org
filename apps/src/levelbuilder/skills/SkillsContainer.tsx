import React from 'react';

interface Skill {
  id: string;
  key: string;
  description: string;
  evaluationCriteria: string;
}

interface SkillsContainerProps {
  canEditSkills: boolean;
  skills: Skill[];
}

const SkillsContainer: React.FC<SkillsContainerProps> = ({
  canEditSkills,
  skills,
}) => {
  return (
    <div>
      <h1>Skills</h1>
      {!canEditSkills && (
        <h3>You need levebuilder permissions to view and edit Skills.</h3>
      )}
      <div>
        {skills.length === 0 ? (
          <p>No skills available.</p>
        ) : (
          <ul>
            {skills.map(skill => (
              <li key={skill.id}>
                <strong>{skill.key}</strong>: {skill.description} -{' '}
                {skill.evaluationCriteria}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
