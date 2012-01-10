require 'test_helper'

class ThumbnailsControllerTest < ActionController::TestCase
  setup do
    @thumbnail = thumbnails(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:thumbnails)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create thumbnail" do
    assert_difference('Thumbnail.count') do
      post :create, :thumbnail => @thumbnail.attributes
    end

    assert_redirected_to thumbnail_path(assigns(:thumbnail))
  end

  test "should show thumbnail" do
    get :show, :id => @thumbnail.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @thumbnail.to_param
    assert_response :success
  end

  test "should update thumbnail" do
    put :update, :id => @thumbnail.to_param, :thumbnail => @thumbnail.attributes
    assert_redirected_to thumbnail_path(assigns(:thumbnail))
  end

  test "should destroy thumbnail" do
    assert_difference('Thumbnail.count', -1) do
      delete :destroy, :id => @thumbnail.to_param
    end

    assert_redirected_to thumbnails_path
  end
end
