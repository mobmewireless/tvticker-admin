# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Emanuel', :city => cities.first)

require 'random_data'


#Program.delete_all
x = 1
thumbnails = Thumbnail.select(:id).map { |x| x.id }
while x<100 do
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
  sleep 2
  p "here"
  imdb = ImdbParty::Imdb.new(:anonymize => true)
  if imdb
    id = "tt0#{ Random.number(100000..999999)}"
    @movie = imdb.find_movie_by_id(id)
    p "#{@movie.title} #{@movie.release_date}"

    if @movie && @movie.poster_url
      p @movie
      @movie.plot = Random.alphanumeric unless @movie.plot

      @movie.poster_url = "http://s3.amazonaws.com/bo-assets/production/tiny_mce_photos/20967/original/haywire_photo.jpg" unless @movie.poster_url
      p @movie.poster_url
      t = Thumbnail.new
      t.name = @movie.title
      t.original_link = @movie.poster_url
      t.remote_image_url = @movie.poster_url

      p t.errors unless t.valid?
      if t.save
        program = Program.new
        program.name = @movie.title
        program.category_id = category[:id]
        program.channel_id = channel[:id]
        program.series_id = Random.number(1..x)
        temp1 = DateTime.parse("#{Random.date} #{(Time.new+rand(9999)).strftime("at %I:%M%p")  }")
        temp2 = DateTime.parse("#{Random.date} #{(Time.new+rand(9999)).strftime("at %I:%M%p")  }")
        program.air_time_start = (temp1>temp2) ? temp2 : temp1
        program.air_time_end = (temp1>temp2) ? temp1 : temp2
        program.run_time = @movie.runtime
        program.imdb_info = @movie.imdb_id
        program.description = @movie.plot
        program.rating = @movie.rating
        program.version_id = Random.number(1..x)
        program.thumbnail= t
        program.save
        x+=1
        p x
      end
    end
  else
    "imdb error"
  end
end
