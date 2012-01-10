require 'test_helper'

class AjaxControllerTest < ActionController::TestCase
  test "should get imdb_auto_complete" do
    get :imdb_auto_complete
    assert_response :success
  end

  test "should get imdb_description" do
    get :imdb_description
    assert_response :success
  end

end
