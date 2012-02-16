class ProgramsController < ApplicationController

  # GET /programs
  # GET /programs.json
  def index
    @programs = Program.order("id desc").page(params[:page])

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @programs }
    end
  end

  # GET /programs/1
  # GET /programs/1.json
  def show
    @program = Program.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @program }
    end
  end

  # GET /programs/new
  # GET /programs/new.json
  def new
    @program = Program.new
    @channels = Channel.all
    @categories = Category.all
    @series = Series.all
    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @program }
    end
  end

  # GET /programs/1/edit
  def edit
    @program = Program.find(params[:id])
    @channels = Channel.all
    @categories = Category.all
    @series = Series.all
  end

  # POST /programs
  # POST /programs.json
  def create
    @program = Program.new(params[:program].merge({:version_attributes=>{},:thumbnail_attributes=>{:name=>params[:program][:name],:original_link=>params[:program][:thumbnail_link],:remote_image_url=>params[:program][:thumbnail_link]} }))
    respond_to do |format|
      if @program.save
        format.html { redirect_to @program, :notice => 'Program was successfully created.' }
        format.json { render :json => @program, :status => :created, :location => @program }
      else
        format.html { render :action => "new" }
        format.json { render :json => @program.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /programs/1
  # PUT /programs/1.json
  def update
    @program = Program.find(params[:id])

    respond_to do |format|
      if @program.update_attributes(params[:program].merge({"version_attributes"=>{},:thumbnail_attributes=>{:name=>params[:program][:name],:original_link=>params[:program][:thumbnail_link],:remote_image_url=>params[:program][:thumbnail_link]}}))
        format.html { redirect_to @program, :notice => 'Program was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @program.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /programs/1
  # DELETE /programs/1.json
  def destroy
    @program = Program.find(params[:id])
    @program.destroy

    respond_to do |format|
      format.html { redirect_to programs_url }
      format.json { head :ok }
    end
  end
end
