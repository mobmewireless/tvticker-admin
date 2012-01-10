module ApplicationHelper
	def custom_image_tag( image_link,options={})
	if image_link
		image_tag image_link,options
	else 
		image_tag "no_image.jpg",options
	end
	end
end
