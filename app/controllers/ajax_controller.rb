class AjaxController < ApplicationController
  
  def imdb_auto_complete
    p params
    imdb = ImdbParty::Imdb.new(:anonymize => true)
    search_result = imdb.find_by_title(params[:term])
    list = search_result.map { |result| Hash[:id=> result[:imdb_id], :label=> result[:title], :title=>result[:title]] }
    render :json => list
  end

  def imdb_description
    imdb = ImdbParty::Imdb.new(:anonymize => true)
    @movie = imdb.find_movie_by_id(params[:imdb_id])
    movie_info = Hash[:imdb_info=> @movie.imdb_id, :plot=> @movie.plot, :title=>@movie.title, :runtime =>get_seconds_from(@movie.runtime),:poster_url=>@movie.poster_url,:rating=>@movie.rating]
    render :json=> movie_info
  end

  def get_seconds_from(time)
    time.to_s.gsub!(/sec\s*$|second\s*$|seconds\s*$/, "seconds")
    time.to_s.gsub!(/min\s*$|minute\s*$|minutes\s*$/, "minutes")
    now = Time.now
    (Chronic.parse("#{time} from now", :now => now) - now) rescue 0
  end

end
