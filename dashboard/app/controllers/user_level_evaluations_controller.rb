require 'json'

class UserLevelEvaluationsController < ApplicationController
  include LevelsHelper
  include Rails.application.routes.url_helpers
  before_action :authenticate_user!
  load_and_authorize_resource :user_level_interaction

  # POST /user_level_evaluations
  def create
    @user_level_evaluation = UserLevelEvaluation.new(user_level_evaluation_params)
    if @user_level_evaluation.save
      render(status: :created, json: {message: "Successfully created UserLevelEvaluation.", id: @user_level_evaluation.id})
    else
      render(status: :not_acceptable, json: {error: 'There was an error creating a new UserLevelEvaluation.'})
    end
  end

  def user_level_evaluation_params
    user_level_evaluation_params = params.transform_keys(&:underscore).permit(
      :level_id,
      :script_id,
      :school_year,
      :evaluation_criteria,
      :ai_evaluation,
      :ai_reasoning,
      :ai_model_version,
    )
    user_level_evaluation_params
  end
end
