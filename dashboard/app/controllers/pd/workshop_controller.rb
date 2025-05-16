module Pd
  class WorkshopController < ApplicationController
    before_action :authenticate_user!

    def index
      if !current_user
        @script_data = {
          props: {
            new_account_url: "/users/sign_up/login_type?user_type=teacher&user_return_to=/pd/workshop/#{@workshop_info.id}",
            existing_account_url: "/users/sign_in?user_return_to=/pd/workshop/#{@workshop_info.id}"
          }.to_json
        }
        render :logged_out
      elsif current_user.user_type == 'student'
        render :students_cannot_enroll
      else
        view_options(full_width: true, responsive_content: true, no_padding_container: true)

        @workshop_info = Pd::Workshop.find(params[:workshop_id])&.summarize_for_marketing_page
      end
    end
  end
end
