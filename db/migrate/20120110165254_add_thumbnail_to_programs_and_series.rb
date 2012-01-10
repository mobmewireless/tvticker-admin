class AddThumbnailToProgramsAndSeries < ActiveRecord::Migration
  def change
   add_column :series, :thumbnail_id, :integer
   add_column :programs, :thumbnail_id, :integer
  end
end
