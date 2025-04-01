export interface UserLevelEvaluation_old {
  userId: number | undefined;
  levelId: number | undefined;
  unitId: number | undefined;
  schoolYear?: string;
  evaluationCriteria: string;
  aiEvaluation: string;
  aiReasoning: string;
  codeVersion?: string;
}

interface StudentWorkEvaluation {
  evaluator: string;
  evaluationCriteria: string;
  evaluation: string;
  reasoning: string;
  type: string;
}

export interface UserLevelSkillEvaluation extends StudentWorkEvaluation {
  studentId: number;
  levelId: number;
  unitId: number;
}

export interface UserLevelEvaluation extends StudentWorkEvaluation {
  studentId: number;
  levelId: number;
  unitId: number;
  codeVersion?: string;
}
