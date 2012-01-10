class ThumbnailsController < ApplicationController
  # GET /thumbnails
  # GET /thumbnails.json
  def index
    @thumbnails = Thumbnail.order("id desc").page params[:page]

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @thumbnails }
    end
  end

  # GET /thumbnails/1
  # GET /thumbnails/1.json
  def show
    @thumbnail = Thumbnail.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @thumbnail }
    end
  end

  # GET /thumbnails/new
  # GET /thumbnails/new.json
  def new
    @thumbnail = Thumbnail.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @thumbnail }
    end
  end

  # GET /thumbnails/1/edit
  def edit
    @thumbnail = Thumbnail.find(params[:id])
  end

  # POST /thumbnails
  # POST /thumbnails.json
  def create
    @thumbnail = Thumbnail.new(params[:thumbnail].merge({"version_attributes"=>{}}))

    respond_to do |format|
      if @thumbnail.save
        format.html { redirect_to @thumbnail, :notice => 'Thumbnail was successfully created.' }
        format.json { render :json => @thumbnail, :status => :created, :location => @thumbnail }
      else
        format.html { render :action => "new" }
        format.json { render :json => @thumbnail.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /thumbnails/1
  # PUT /thumbnails/1.json
  def update
    @thumbnail = Thumbnail.find(params[:id])

    respond_to do |format|
      if @thumbnail.update_attributes(params[:thumbnail].merge({"version_attributes"=>{}}))
        format.html { redirect_to @thumbnail, :notice => 'Thumbnail was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @thumbnail.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /thumbnails/1
  # DELETE /thumbnails/1.json
  def destroy
    @thumbnail = Thumbnail.find(params[:id])
    @thumbnail.destroy

    respond_to do |format|
      format.html { redirect_to thumbnails_url }
      format.json { head :ok }
    end
  end
end
