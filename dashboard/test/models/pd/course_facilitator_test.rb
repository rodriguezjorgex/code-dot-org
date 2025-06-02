require 'test_helper'

class Pd::CourseFacilitatorTest < ActiveSupport::TestCase
  def setup
    @csf = Pd::Workshop::COURSE_CSF
    @csd = Pd::Workshop::COURSE_CSD
    @aif = Pd::Workshop::COURSE_AIF
    @facilitator1 = create :facilitator, name: 'Facilitator 1'
    @facilitator2 = create :facilitator, name: 'Facilitator 2'
    @facilitator3 = create :facilitator, name: 'Facilitator 3'
  end

  def create_course_facilitator(facilitator, course)
    create :pd_course_facilitator, facilitator: facilitator, course: course
  end

  def create_offering(permissions)
    create :course_offering, facilitator_course_permissions: permissions
  end

  test 'facilitators_for_course' do
    # two CSf, one AIF
    create_course_facilitator(@facilitator1, @csf)
    create_course_facilitator(@facilitator2, @csf)
    create_course_facilitator(@facilitator3, @aif)

    facilitators = Pd::CourseFacilitator.facilitators_for_course @csf
    assert_equal 2, facilitators.length
  end

  test 'facilitators_for_course with course_offering_ids and all have permissions' do
    create_course_facilitator(@facilitator1, @csf)
    create_course_facilitator(@facilitator2, @csd)
    create_course_facilitator(@facilitator3, @aif)
    offering1 = create_offering([@csf, @csd])
    offering2 = create_offering([@aif])
    facilitators = Pd::CourseFacilitator.facilitators_for_course(@csf, [offering1.id, offering2.id])
    assert_equal [@facilitator1, @facilitator2, @facilitator3].sort_by(&:name), facilitators.sort_by(&:name)
  end

  test 'facilitators_for_course with course_offering_ids and some have permissions' do
    create_course_facilitator(@facilitator1, @csf)
    create_course_facilitator(@facilitator2, @csd)
    create_course_facilitator(@facilitator3, @aif)
    offering1 = create_offering([@csf, @csd])
    facilitators = Pd::CourseFacilitator.facilitators_for_course(@csf, [offering1.id])
    assert_equal [@facilitator1, @facilitator2].sort_by(&:name), facilitators.sort_by(&:name)
  end

  test 'facilitators_for_course with course_offering_ids and any blank permissions returns all' do
    create_course_facilitator(@facilitator1, @csf)
    create_course_facilitator(@facilitator2, @csd)
    offering1 = create_offering(nil)
    offering2 = create_offering([@csf])
    facilitators = Pd::CourseFacilitator.facilitators_for_course(@csf, [offering1.id, offering2.id])
    all_facilitators = Pd::CourseFacilitator.all.map(&:facilitator)
    assert_equal all_facilitators.sort_by(&:id), facilitators.sort_by(&:id)
  end

  test 'facilitators_for_course with course_offering_ids and all empty permissions returns all' do
    create_course_facilitator(@facilitator1, @csf)
    create_course_facilitator(@facilitator2, @csd)
    offering1 = create_offering([])
    facilitators = Pd::CourseFacilitator.facilitators_for_course(@csf, [offering1.id])
    all_facilitators = Pd::CourseFacilitator.all.map(&:facilitator)
    assert_equal all_facilitators.sort_by(&:id), facilitators.sort_by(&:id)
  end

  test 'duplicates are not allowed' do
    facilitator = create :facilitator
    create :pd_course_facilitator, facilitator: facilitator, course: @csf

    duplicate = build :pd_course_facilitator, facilitator: facilitator, course: @csf
    refute duplicate.valid?

    different_course = build :pd_course_facilitator, facilitator: facilitator, course: Pd::Workshop::COURSE_CSP
    assert different_course.valid?, different_course.errors.full_messages

    different_facilitator = build :pd_course_facilitator, course: @csf
    assert different_facilitator.valid?, different_course.errors.full_messages
  end
end
