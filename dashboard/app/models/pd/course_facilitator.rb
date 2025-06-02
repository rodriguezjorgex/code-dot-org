# == Schema Information
#
# Table name: pd_course_facilitators
#
#  id             :integer          not null, primary key
#  facilitator_id :integer          not null
#  course         :string(255)      not null
#
# Indexes
#
#  index_pd_course_facilitators_on_course                     (course)
#  index_pd_course_facilitators_on_facilitator_id_and_course  (facilitator_id,course) UNIQUE
#

class Pd::CourseFacilitator < ApplicationRecord
  belongs_to :facilitator, class_name: 'User', optional: true

  validates_inclusion_of :course, in: Pd::Workshop::COURSES
  validates_uniqueness_of :course, scope: :facilitator_id, case_sensitive: true

  def self.facilitators_for_course(course, course_offering_ids = nil)
    permitted_courses = [course]
    if course_offering_ids.present?
      course_offerings = CourseOffering.where(id: course_offering_ids)
      permissions_arrays = course_offerings.map(&:facilitator_course_permissions)
      # If any permissions array is nil or empty, return all facilitator users
      if permissions_arrays.any?(&:blank?)
        return User.joins(:courses_as_facilitator).order(:name)
      else
        # Get all facilitator_course_permissions arrays, flatten, remove nils, and filter to unique values
        permitted_courses = permissions_arrays.compact.flatten.uniq
      end
    end
    User.joins(:courses_as_facilitator).
      where(table_name => {course: permitted_courses}).
      order(:name)
  end
end
