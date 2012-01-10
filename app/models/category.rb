class Category < ActiveRecord::Base
  has_many :programs
  belongs_to :version
  accepts_nested_attributes_for :version
  validates_presence_of :name
  scope :version_greater_than, lambda { |v| where("version_id > :version_id", {:version_id =>v}).select(column_names - ["version_id"]) }
end
