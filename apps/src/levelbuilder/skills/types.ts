export interface SkillsByConcept {
  [key: string]: Array<Skill>;
}

export interface SkillIdentifiers {
  id: number;
  key: string;
}
export interface Skill extends SkillIdentifiers {
  concept: string;
  description: string;
  evaluationCriteria: string;
}

export interface Levels {
  levelId: number;
  levelName: string;
  unitNames: string[];
  skills: SkillIdentifiers[];
}

export interface LevelsSkill {
  skillId: number;
  levelId: number;
}
