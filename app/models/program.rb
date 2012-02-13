class Program < ActiveRecord::Base

  belongs_to :category
  belongs_to :series
  belongs_to :channel
  belongs_to :version
  belongs_to :thumbnail
  accepts_nested_attributes_for :version
  accepts_nested_attributes_for :thumbnail
  validates_presence_of :name
  validates_presence_of :channel_id
  scope :version_greater_than, lambda { |v| where("version_id > :version_id", {:version_id =>v}).select(column_names - ["version_id"]) }
  before_save :set_default_values

  def set_default_values
    if self.series_id == ""
      self.series_id = 0
    end
    if self.channel_id == ""
      self.channel_id = 0
    end
    if self.category_id == ""
      self.category_id = 0
    end
  end
end
