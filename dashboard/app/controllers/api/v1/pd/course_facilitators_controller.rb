class Api::V1::Pd::CourseFacilitatorsController < ApplicationController
  authorize_resource class: 'Pd::CourseFacilitator'

  # GET /api/v1/pd/course_facilitators
  def index
    facilitators =
      if params.key?(:course)
        course_offerings = params[:course_offerings] if params.key?(:course_offerings)
        Pd::CourseFacilitator.facilitators_for_course(
          params.require(:course),
          course_offerings
        )
      else
        Pd::CourseFacilitator.all.map(&:facilitator)
      end.compact.uniq.sort_by(&:name)

    render json: facilitators, each_serializer: Api::V1::Pd::CourseFacilitatorSerializer
  end
end
