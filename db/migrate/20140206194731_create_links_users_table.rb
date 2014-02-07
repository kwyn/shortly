class CreateLinksUsersTable < ActiveRecord::Migration
  def change
    create_table :link_users do |t|
      t.integer :link_id
      t.integer :user_id
    end
  end
end
