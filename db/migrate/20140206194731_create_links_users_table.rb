class CreateLinksUsersTable < ActiveRecord::Migration
  def change
    create_table :links_users do |t|
      t.belongs_to :link
      t.belongs_to :user
    end
  end
end
