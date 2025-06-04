import MetricsReporter from '@cdo/apps/metrics/MetricsReporter';
import {MetricEvent} from '@cdo/apps/metrics/events';
import {getAuthenticityToken} from '@cdo/apps/util/AuthenticityTokenStore';

interface Skill {
  key: string;
  description: string;
  evaluationCriteria: string;
  concept: string;
}

export async function createSkill(skill: Skill) {
  try {
    const response = await fetch(`/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': await getAuthenticityToken(),
      },
      body: JSON.stringify(skill),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const msg = `Network response was not ok creating skill ${JSON.stringify(
        errorData,
        null,
        2
      )}`;
      console.error(msg);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    MetricsReporter.logError({
      event: MetricEvent.AI_TUTOR_CHAT_SAVE_FAIL,
      errorMessage:
        (error as Error).message || 'Failed to save AI Tutor interaction',
    });
  }
}
