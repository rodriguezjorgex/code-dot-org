class UserLevelSkillEvaluation < StudentWorkEvaluation
  validates :student_id, presence: true
  validates :level_id, presence: true
  validates :unit_id, presence: true
end
