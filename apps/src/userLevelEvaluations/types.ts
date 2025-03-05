export interface UserLevelEvaluation {
  userId: number | undefined;
  levelId: number | undefined;
  scriptId: number | undefined;
  schoolYear?: string;
  evaluationCriteria: string;
  aiEvaluation: string;
  aiReasoning: string;
}
