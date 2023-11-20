class CreateUnits < ActiveRecord::Migration[7.1]
  def change
    create_table :units do |t|
      t.string :name
      t.string :description
      t.integer :year
      t.text :interests
      t.text :requirements

      t.timestamps
    end
  end
end
