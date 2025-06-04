import {createSkill} from '@cdo/apps/levelbuilder/skills/SkillsApi';
import HttpClient from '@cdo/apps/util/HttpClient';

describe('skillsApi', () => {
  let post: jest.Mock;

  beforeEach(() => {
    post = jest.fn();
    HttpClient.post = post;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSkill', () => {
    it('should call createSkill with correct URL and valid parameters', async () => {
      const skillData = {
        key: 'new_skill',
        description: 'This is a new skill',
        evaluationCriteria: 'Criteria for evaluation',
        concept: 'Testing',
      };
      const expectedResponse = {
        status: 'success',
        message: 'Skill saved successfully',
      };
      post.mockResolvedValue(new Response(JSON.stringify(expectedResponse)));

      const response = await createSkill(skillData);

      expect(post).toHaveBeenCalledTimes(1);
      expect(post.mock.calls[0][0]).toMatch(/^\/skills$/);
      expect(post.mock.calls[0][1]).toBe(JSON.stringify(skillData));
      expect(response).toEqual(expectedResponse);
    });
  });
});
