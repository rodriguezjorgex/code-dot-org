import {MetricEvent} from '@cdo/apps/metrics/events';
import MetricsReporter from '@cdo/apps/metrics/MetricsReporter';
import {getAuthenticityToken} from '@cdo/apps/util/AuthenticityTokenStore';

import {AIResponse, StudentAnswer} from './aiEvaluationApi';
import {UserLevelEvaluation, UserLevelSkillEvaluation} from './types';

export async function logStudentWorkEvaluations(
  studentWorkSample: StudentAnswer,
  parsedResponse: AIResponse,
  levelId: number,
  unitId: number
) {
  logUserLevelEvaluation({
    type: 'UserLevelEvaluation',
    studentId: studentWorkSample.studentId,
    levelId: levelId,
    unitId: unitId,
    evaluator: 'AI',
    evaluationCriteria: parsedResponse.evaluationCriteria,
    evaluation: parsedResponse.aiEvaluation,
    reasoning: parsedResponse.aiReasoning,
  });
  // For each specific skill-based evaluation, log a UserLevelSkillEvaluation
  if (parsedResponse.skillEvaluations) {
    parsedResponse.skillEvaluations.forEach((skillEvaluation: AIResponse) => {
      logUserLevelSkillEvaluation({
        type: 'UserLevelSkillEvaluation',
        studentId: studentWorkSample.studentId,
        levelId: levelId,
        unitId: unitId,
        evaluator: 'AI',
        evaluationCriteria: skillEvaluation.evaluationCriteria,
        evaluation: skillEvaluation.aiEvaluation,
        reasoning: skillEvaluation.aiReasoning,
      });
    });
    // TODO: Log an EvaulationSummary associating the UserLevelSkillEvaluation with the UserLevelEvaluation
  }
}

export async function logUserLevelEvaluation(
  evaluationData: UserLevelEvaluation
) {
  try {
    const response = await fetch('/student_work_evaluations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': await getAuthenticityToken(),
      },
      body: JSON.stringify(evaluationData),
    });
    if (!response.ok) {
      throw new Error('Failed to save UserLevelEvaluation');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    MetricsReporter.logError({
      event: MetricEvent.USER_LEVEL_EVALUATION_SAVE_FAIL,
      errorMessage:
        (error as Error).message || 'Failed to save UserLevelEvaluation',
    });
  }
}

export async function logUserLevelSkillEvaluation(
  evaluationData: UserLevelSkillEvaluation
) {
  try {
    const response = await fetch('/student_work_evaluations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': await getAuthenticityToken(),
      },
      body: JSON.stringify(evaluationData),
    });
    if (!response.ok) {
      throw new Error('Failed to save UserLevelSkillEvaluation');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    MetricsReporter.logError({
      // TODO: Update error message to reflect new type
      event: MetricEvent.USER_LEVEL_EVALUATION_SAVE_FAIL,
      errorMessage:
        (error as Error).message || 'Failed to save UserLevelSkillEvaluation',
    });
  }
}
