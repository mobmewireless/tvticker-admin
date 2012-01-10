class Series < ActiveRecord::Base
	has_many :programs
	belongs_to :version
	belongs_to :thumbnail
	accepts_nested_attributes_for :version
	accepts_nested_attributes_for :thumbnail
	validates_presence_of :name
	scope :version_greater_than, lambda { |v| where("version_id > :version_id", {:version_id =>v}).select(column_names - ["version_id"]) }
end
