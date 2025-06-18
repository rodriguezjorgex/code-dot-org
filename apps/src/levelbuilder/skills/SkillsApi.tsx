import {MetricEvent} from '@cdo/apps/metrics/events';
import MetricsReporter from '@cdo/apps/metrics/MetricsReporter';
import HttpClient from '@cdo/apps/util/HttpClient';

import {LevelsSkill, Skill} from './types';

export async function createSkill(skill: Skill) {
  const response = await HttpClient.post(
    '/skills',
    JSON.stringify(skill),
    true,
    {
      'Content-Type': 'application/json; charset=UTF-8',
    }
  )
    .then(response => response.json())
    .then(json => {
      if (json.status === 'success') {
        return json;
      } else {
        throw new Error(`Failed to create skill: ${json.error}`);
      }
    })
    .catch(error => {
      MetricsReporter.logError({
        event: MetricEvent.SKILL_SAVE_FAIL,
        errorMessage: (error as Error).message || 'Failed to save Skill',
      });
    });
  return response;
}

export async function createLevelsSkill(levelsSkill: LevelsSkill) {
  const response = await HttpClient.post(
    `/levels/${levelsSkill.levelId}/skills/${levelsSkill.skillId}`,
    JSON.stringify(levelsSkill),
    true,
    {
      'Content-Type': 'application/json; charset=UTF-8',
    }
  )
    .then(response => response.json())
    .then(json => {
      if (json.status === 'success') {
        return json;
      } else {
        throw new Error(`Failed to create LevelsSkill: ${json.error}`);
      }
    })
    .catch(error => {
      MetricsReporter.logError({
        event: MetricEvent.LEVELS_SKILL_SAVE_FAIL,
        errorMessage: (error as Error).message || 'Failed to save LevelsSkill',
      });
    });

  return response;
}

export async function removeSkillFromLevel(levelId: number, skillId: number) {
  try {
    const response = await HttpClient.delete(
      `/levels/${levelId}/skills/${skillId}`,
      true,
      {
        'Content-Type': 'application/json; charset=UTF-8',
      }
    );
    const json = await response.json();
    if (json.status === 'success') {
      return json;
    } else {
      throw new Error(`Failed to remove skill from level: ${json.error}`);
    }
  } catch (error) {
    MetricsReporter.logError({
      event: MetricEvent.LEVELS_SKILL_DELETE_FAIL,
      errorMessage:
        (error as Error).message || 'Failed to remove Skill from Leve',
    });
    throw error;
  }
}
