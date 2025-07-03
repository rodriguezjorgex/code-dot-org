module SkillsHelper
  def self.get_section_skills_data(section, unit)
    student_ids = section.students.pluck(:id)
    skill_ids = unit.levels.joins(:skills).
                       pluck('skills.id').
                       uniq

    evaluations_data = UserLevelSkillEvaluation.where(
      student_id: student_ids,
      unit_id: unit.id,
      skill_id: skill_ids
    ).pluck(:student_id, :skill_id, :evaluation)

    evaluation_records = evaluations_data.map do |student_id, skill_id, evaluation|
      {
        student_id: student_id,
        skill_id: skill_id,
        evaluation: evaluation
      }
    end

    evaluations_by_student_skill = evaluation_records.group_by {|record| [record[:student_id], record[:skill_id]]}

    result = {}

    student_ids.each do |student_id|
      result[student_id] = {}

      skill_ids.each do |skill_id|
        student_skill_evaluations = evaluations_by_student_skill[[student_id, skill_id]] || []
        evaluation_values = student_skill_evaluations.pluck(:evaluation)
        mastery_level = determine_mastery_level_for_student(evaluation_values)

        result[student_id][skill_id] = {
          mastery_level: mastery_level
        }
      end
    end

    result
  end

  def self.determine_mastery_level_for_student(evaluations)
    return "Not seen" if evaluations.empty?

    return "Mastered" if evaluations.include?(SharedConstants::STUDENT_WORK_EVALUATION_STATUS[:ALL_COMPLETE_CORRECT])
    return "Shown" if evaluations.include?(SharedConstants::STUDENT_WORK_EVALUATION_STATUS[:PARTIAL_COMPLETE_CORRECT_COMPLETE_CORRECT])
    return "Needs practice" if evaluations.all?(SharedConstants::STUDENT_WORK_EVALUATION_STATUS[:ALL_INCOMPLETE_INCORRECT])

    "Not seen"
  end

  private_class_method :determine_mastery_level_for_student
end
