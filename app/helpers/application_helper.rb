module ApplicationHelper
	def thumbnail_tag( object,options={})
		image_link = object.thumbnail.image.versions[:thumbnail].url rescue nil
	 if image_link
		image_tag image_link,options
	 else 
		image_tag "no_image.jpg",options
	 end
	end

	def build_imdb_link(imdb_id)
		"http://www.imdb.com/title/#{imdb_id}"
	end
end
