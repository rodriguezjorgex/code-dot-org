import {
  createSkill,
  createLevelsSkill,
  removeSkillFromLevel,
} from '@cdo/apps/levelbuilder/skills/SkillsApi';
import HttpClient from '@cdo/apps/util/HttpClient';

describe('skillsApi', () => {
  const skillData = {
    id: 0,
    key: 'new_skill',
    description: 'This is a new skill',
    evaluationCriteria: 'Criteria for evaluation',
    concept: 'Testing',
  };
  const successResponse = {
    status: 'success',
    message: 'Skill saved successfully',
  };

  const spy = jest.spyOn(HttpClient, 'post');

  beforeEach(() => {
    spy.mockResolvedValue(
      new Response(JSON.stringify(successResponse), {
        status: 200,
        statusText: 'OK',
        headers: new Headers({'Content-Type': 'application/json'}),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSkill', () => {
    it('should call createSkill with correct URL and valid parameters', async () => {
      const response = await createSkill(skillData);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        '/skills',
        JSON.stringify(skillData),
        true,
        {'Content-Type': 'application/json; charset=UTF-8'}
      );
      expect(response).toEqual(successResponse);
    });
  });

  describe('createLevelsSkill', () => {
    const levelsSkillData = {levelId: 1, skillId: 2};
    const levelsSkillSuccessResponse = {
      status: 'success',
      message: 'LevelsSkill saved successfully',
    };
    const postSpy = jest.spyOn(HttpClient, 'post');

    beforeEach(() => {
      postSpy.mockResolvedValue(
        new Response(JSON.stringify(levelsSkillSuccessResponse), {
          status: 201,
          statusText: 'Created',
          headers: new Headers({'Content-Type': 'application/json'}),
        })
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call createLevelsSkill with correct URL and valid parameters', async () => {
      const response = await createLevelsSkill(levelsSkillData);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        '/levels_skills',
        JSON.stringify(levelsSkillData),
        true,
        {'Content-Type': 'application/json; charset=UTF-8'}
      );
      expect(response).toEqual(levelsSkillSuccessResponse);
    });
  });

  describe('removeSkillFromLevel', () => {
    const levelId = 1;
    const skillId = 2;
    const removeSuccessResponse = {
      status: 'success',
      message: 'LevelsSkill deleted successfully',
    };
    const deleteSpy = jest.spyOn(HttpClient, 'delete');

    beforeEach(() => {
      deleteSpy.mockResolvedValue(
        new Response(JSON.stringify(removeSuccessResponse), {
          status: 200,
          statusText: 'OK',
          headers: new Headers({'Content-Type': 'application/json'}),
        })
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call removeSkillFromLevel with correct URL and return success', async () => {
      const response = await removeSkillFromLevel(levelId, skillId);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(
        `/levels/${levelId}/skills/${skillId}`,
        true,
        {'Content-Type': 'application/json; charset=UTF-8'}
      );
      expect(response).toEqual(removeSuccessResponse);
    });
  });
});
