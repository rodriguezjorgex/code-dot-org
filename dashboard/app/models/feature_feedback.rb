# == Schema Information
#
# Table name: feature_feedbacks
#
#  id           :bigint           not null, primary key
#  user_id      :integer          not null
#  level_id     :integer
#  script_id    :integer
#  thumbs_up    :boolean
#  school_year  :string(255)
#  metadata     :json
#  feature_type :string(255)      not null
#  feature_id   :bigint           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_feature_feedbacks_on_feature  (feature_type,feature_id)
#
class FeatureFeedback < ApplicationRecord
  belongs_to :feature, polymorphic: true
end
