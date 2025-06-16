export interface SkillsByConcept {
  [key: string]: Array<Skill>;
}

export interface Skill {
  id?: string;
  key: string;
  concept: string;
  description: string;
  evaluationCriteria: string;
}

export interface Levels {
  levelId: number;
  levelName: string;
  unitNames: string[];
  skillKeys: string[];
}

export interface LevelsSkill {
  skillId: number;
  levelId: number;
}
