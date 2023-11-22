class CreateCourses < ActiveRecord::Migration[7.1]
  def change
    create_table :courses do |t|
      t.string :name
      t.text :description
      t.integer :year
      t.text :interests
      t.text :requirements

      t.timestamps
    end
  end
end
