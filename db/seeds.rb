# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Emanuel', :city => cities.first)

require 'random_data'
# load "#{File.expand_path(File.dirname(__FILE__))}/../lib/mobme/enterprise/tv_channel_info/models.rb"


x = 100
x.times do
  Version.create
  channel = Channel.new
  channel.name = Random.alphanumeric
  channel.version_id = Random.number(1..x)
  channel.save
  series = Series.new
  series.name = Random.alphanumeric
  series.imdb_info = "http://www.imdb.com/title/tt0#{ Random.number(100000..999999)}/"
  series.description = Random.paragraphs
  series.rating = Random.number(1..10)
  series.version_id = Random.number(1..x)
  series.save
  category = Category.new
  category.name = Random.alphanumeric
  category.version_id = Random.number(1..x)
  category.save
  program = Program.new

  program.name = Random.alphanumeric
  program.category_id = Random.number(1..x)
  program.channel_id = Random.number(1..x)
  program.series_id = Random.number(1..x)
  temp1 = DateTime.parse("#{Random.date} #{(Time.new+rand(9999)).strftime("at %I:%M%p")  }")
  temp2 = DateTime.parse("#{Random.date} #{(Time.new+rand(9999)).strftime("at %I:%M%p")  }")
  program.air_time_start = (temp1>temp2) ? temp2 : temp1
  program.air_time_end = (temp1>temp2) ? temp1 : temp2
  program.run_time = program.air_time_end.to_time.to_i - program.air_time_start.to_time.to_i
  program.imdb_info = "http://www.imdb.com/title/tt0#{ Random.number(100000..999999)}/"
  program.description = Random.paragraphs
  program.rating = Random.number(1..10)
  program.version_id = Random.number(1..x)
  program.save

end
