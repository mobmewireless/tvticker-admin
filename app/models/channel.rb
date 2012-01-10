class Channel < ActiveRecord::Base
  has_many :programs
  belongs_to :version
  accepts_nested_attributes_for :version
  scope :version_greater_than, lambda { |v| where("version_id > :version_id", {:version_id =>v}).select(column_names - ["version_id"]) }
end
