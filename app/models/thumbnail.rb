class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick
  storage :file

  def store_dir
    "uploads/users/#{model.id}/image"
  end

  def extensions_white_list
    %w(jpg jpeg gif png)
  end

  process :resize_to_limit => [720, 720]
  version :icon40 do
    process :resize_to_fill => [40, 40]
  end
  version :icon60 do
    process :resize_to_limit => [60, 60]
  end
  version :thumbnail do
    process :resize_to_limit => [140, 120]
  end
  version :profile do
    process :resize_to_limit => [180, 180]
  end
end

class Thumbnail < ActiveRecord::Base
  belongs_to :version
  has_many :programs
  has_many :series
  accepts_nested_attributes_for :version
  attr_accessible :image, :remote_image_url, :image_cache, :image_avatar,:name,:original_link
  #validates_presence_of :name
 # validates_presence_of :original_link
  mount_uploader :image, ImageUploader
  scope :version_greater_than, lambda { |v| where("version_id > :version_id", {:version_id =>v}).select(column_names - ["version_id"]) }
end
