class Version < ActiveRecord::Base
  has_many :categories
  has_many :channels
  has_many :programs
  has_many :series
  has_many :thumbnails
  accepts_nested_attributes_for :categories,:channels,:programs,:series,:thumbnails

  before_save :init_version
  def init_version
    self.number = "#{Time.now.to_i}#{UUID.generate.gsub("-", "")}"
  end
  scope :version_greater_than, lambda { |v| where("id > :version_id", {:version_id =>v}) }
end
