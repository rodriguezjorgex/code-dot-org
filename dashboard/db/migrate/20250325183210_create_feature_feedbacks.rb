class CreateFeatureFeedbacks < ActiveRecord::Migration[6.1]
  def change
    create_table :feature_feedbacks do |t|
      t.string :feature, null: false
      t.integer :feature_id
      t.integer :user_id, null: false
      t.integer :level_id
      t.integer :script_id
      t.boolean :thumbs_up
      t.string :school_year
      t.json :metadata

      t.timestamps

      t.index :feature
    end
  end
end
