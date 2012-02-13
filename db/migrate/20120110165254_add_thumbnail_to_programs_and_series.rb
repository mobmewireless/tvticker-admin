class AddThumbnailToProgramsAndSeries < ActiveRecord::Migration
  def change
    add_column :series, :thumbnail_id, :integer, :default=>0
    add_column :programs, :thumbnail_id, :integer, :default=>0
  end
end
