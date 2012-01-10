class SeriesController < ApplicationController
  # GET /series
  # GET /series.json
  def index
    @series = Series.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @series }
    end
  end

  # GET /series/1
  # GET /series/1.json
  def show
    @series = Series.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @series }
    end
  end

  # GET /series/new
  # GET /series/new.json
  def new
    @series = Series.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @series }
    end
  end

  # GET /series/1/edit
  def edit
    @series = Series.find(params[:id])
  end

  # POST /series
  # POST /series.json
  def create
    @series = Series.new(params[:series].merge({"version_attributes"=>{}}))

    respond_to do |format|
      if @series.save
        format.html { redirect_to @series, :notice => 'Series was successfully created.' }
        format.json { render :json => @series, :status => :created, :location => @series }
      else
        format.html { render :action => "new" }
        format.json { render :json => @series.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /series/1
  # PUT /series/1.json
  def update
    @series = Series.find(params[:id])

    respond_to do |format|
      if @series.update_attributes(params[:series].merge({"version_attributes"=>{}}))
        format.html { redirect_to @series, :notice => 'Series was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @series.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /series/1
  # DELETE /series/1.json
  def destroy
    @series = Series.find(params[:id])
    @series.destroy

    respond_to do |format|
      format.html { redirect_to series_index_url }
      format.json { head :ok }
    end
  end
end
