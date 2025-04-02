class UserLevelSkillEvaluation < StudentWorkEvaluation
  alias_attribute :user_id, :student_id
  alias_attribute :script_id, :unit_id

  validates :student_id, presence: true
  validates :level_id, presence: true
  validates :unit_id, presence: true
  # TODO: Add validation for skill_id
end
