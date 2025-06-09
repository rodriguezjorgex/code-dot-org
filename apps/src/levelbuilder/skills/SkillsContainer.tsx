import React from 'react';
import {SimpleDropdown} from '@code-dot-org/component-library/dropdown';

interface SkillsByConcept {
  [key: string]: Array<Skill>;
}

interface Skill {
  id: string;
  key: string;
  concept: string;
  description: string;
  evaluationCriteria: string;
}

interface SkillsContainerProps {
  canEditSkills: boolean;
  skills: SkillsByConcept;
}

const SkillsContainer: React.FC<SkillsContainerProps> = ({
  canEditSkills,
  skills,
}) => {
  console.log('skills', skills);
  const [selectedConcept, setSelectedConcept] = React.useState('');
  const concepts = Object.keys(skills)
    .sort((a, b) => a.localeCompare(b))
    .map(concept => ({
      value: concept,
      text: concept,
    }));
  concepts.push({value: '', text: 'Select a concept'});
  console.log('concepts', concepts);
  console.log('selectedConcept', selectedConcept);
  const skillsToShow = skills[selectedConcept] || [];
  return (
    <div>
      <h1>Skills</h1>
      {!canEditSkills && (
        <h3>You need levebuilder permissions to view and edit Skills.</h3>
      )}
      {canEditSkills && (
        <div>
          <SimpleDropdown
            labelText="Concept"
            name="concept"
            size="s"
            onChange={e => {
              setSelectedConcept(e.target.value);
            }}
            selectedValue={selectedConcept}
            items={concepts}
          ></SimpleDropdown>
          {skillsToShow.length > 0 ? (
            skillsToShow.map(skill => (
              <div key={skill.id}>
                <p>Id: {skill.id}</p>
                <p>Key: {skill.key}</p>
                <p>{skill.description}</p>
                <p>{skill.evaluationCriteria}</p>
              </div>
            ))
          ) : (
            <p>No skills available for this concept.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsContainer;
