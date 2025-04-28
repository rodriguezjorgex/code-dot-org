require_relative 'middleware_test_helper' # Must be required first to establish load paths
require 'mocha/mini_test'
require_relative '../../middleware/animation_library_api'
require 'cdo/aws/s3'

class AnimationLibraryTest < Minitest::Test
  include Rack::Test::Methods
  include SetupTest

  def app
    AnimationLibraryApi
  end

  def setup
    # Mock AWS S3 for all tests
    @s3_client = Minitest::Mock.new
    @s3_bucket = Minitest::Mock.new
    AWS::S3.class_eval do
      class << self
        attr_accessor :s3
      end
    end

    # Create mock users with appropriate permissions
    @admin_user = mock_admin_user
    @levelbuilder_user = mock_levelbuilder_user
    @regular_user = mock_regular_user
    @admin_and_levelbuilder_user = mock_admin_and_levelbuilder_user
  end

  def teardown
    AWS::S3.s3 = nil
  end

  # Helper methods to create mock users with appropriate permissions
  def mock_admin_user
    user = Object.new
    def user.admin?; true; end
    def user.levelbuilder?; false; end
    user
  end

  def mock_levelbuilder_user
    user = Object.new
    def user.admin?; false; end
    def user.levelbuilder?; true; end
    user
  end

  def mock_regular_user
    user = Object.new
    def user.admin?; false; end
    def user.levelbuilder?; false; end
    user
  end

  def mock_admin_and_levelbuilder_user
    user = Object.new
    def user.admin?; true; end
    def user.levelbuilder?; true; end
    user
  end

  # Tests for GET endpoints
  def test_animation_not_found
    get '/api/v1/animation-library/spritelab/version/animation_not_found.png'
    assert last_response.not_found?
  end

  def test_get_spritelab_animation
    contents = 'TEST_ANIMATION'
    # Configure the mock response
    resp = {body: contents, content_type: 'image/png'}
    @s3_client.expect :get_object, resp, [{bucket: AnimationLibraryApi::ANIMATION_LIBRARY_BUCKET, key: 'spritelab/version/test_animation.png'}]
    AWS::S3.s3 = @s3_client

    get '/api/v1/animation-library/spritelab/version/test_animation.png'
    assert last_response.ok?
    assert_equal contents, last_response.body
  end

  def test_get_gamelab_animation
    contents = 'TEST_ANIMATION'
    # Configure the mock response
    resp = {body: contents, content_type: 'image/png'}
    @s3_client.expect :get_object, resp, [{bucket: AnimationLibraryApi::ANIMATION_LIBRARY_BUCKET, key: 'gamelab/version/test_animation.png'}]
    AWS::S3.s3 = @s3_client

    get '/api/v1/animation-library/gamelab/version/test_animation.png'
    assert last_response.ok?
    assert_equal contents, last_response.body
  end

  def test_get_spritelab_manifest
    contents = 'TEST_MANIFEST'
    # Configure the mock response
    resp = {body: contents, content_type: 'json'}
    @s3_client.expect :get_object, resp, [{bucket: AnimationLibraryApi::ANIMATION_LIBRARY_BUCKET, key: 'manifest/spritelab/en_us'}]
    AWS::S3.s3 = @s3_client

    get '/api/v1/animation-library/manifest/spritelab/en_us'
    assert last_response.ok?
    assert_equal contents, last_response.body
  end

  def test_not_found
    get '/api/v1/animation-library/animation_not_found.png'
    assert last_response.not_found?
    get '/api/v1/animation-library/xyz/'
    assert last_response.not_found?
  end

  def test_get_animation
    contents = 'TEST_ANIMATION'
    # Configure the mock response
    resp = {body: contents, content_type: 'image/png'}
    @s3_client.expect :get_object, resp, [{bucket: AnimationLibraryApi::ANIMATION_LIBRARY_BUCKET, key: 'version/test_animation.png'}]
    AWS::S3.s3 = @s3_client

    get '/api/v1/animation-library/version/test_animation.png'
    assert last_response.ok?
    assert_equal contents, last_response.body
  end

  # Test cases for authentication requirements

  def test_post_level_animations_with_no_user
    # Attempt to upload with no user in session
    post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', {'CONTENT_TYPE' => 'image/png'}
    assert_equal 403, last_response.status
  end

  def test_post_level_animations_with_only_admin_user
    # Mock the session using an admin user
    env 'rack.session', {user: @admin_user}

    # Test should fail as both admin AND levelbuilder are required
    post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', {'CONTENT_TYPE' => 'image/png'}
    assert_equal 403, last_response.status
  end

  def test_post_level_animations_with_only_levelbuilder_user
    # Mock the session using a levelbuilder user
    env 'rack.session', {user: @levelbuilder_user}

    # Test should fail as both admin AND levelbuilder are required
    post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', {'CONTENT_TYPE' => 'image/png'}
    assert_equal 403, last_response.status
  end

  def test_post_level_animations_with_admin_and_levelbuilder_user
    # Mock the session using a user with both admin AND levelbuilder permissions
    env 'rack.session', {user: @admin_and_levelbuilder_user}

    # For this test, we'll stub out the S3 interaction
    s3_bucket = @s3_bucket
    Aws::S3::Bucket.stubs(:new).returns(s3_bucket)
    s3_bucket.stubs(:put_object).returns(true)

    post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', {'CONTENT_TYPE' => 'image/png'}
    assert_equal 200, last_response.status
  end

  def test_post_level_animations_with_regular_user
    # Mock the session using a regular user with no special permissions
    env 'rack.session', {user: @regular_user}

    post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', {'CONTENT_TYPE' => 'image/png'}
    assert_equal 403, last_response.status
  end

  def test_post_spritelab_with_admin_and_levelbuilder_user
    # Mock the session using a user with both admin AND levelbuilder permissions
    env 'rack.session', {user: @admin_and_levelbuilder_user}

    # For this test, we'll stub out the S3 interaction
    s3_bucket = @s3_bucket
    Aws::S3::Bucket.stubs(:new).returns(s3_bucket)
    s3_bucket.stubs(:put_object).returns(true)

    post '/api/v1/animation-library/spritelab/animals/test_animation.png', 'TEST_DATA', {'CONTENT_TYPE' => 'image/png'}
    assert_equal 200, last_response.status
  end

  def test_post_default_metadata_with_admin_and_levelbuilder_user
    # Mock the session using a user with both admin AND levelbuilder permissions
    env 'rack.session', {user: @admin_and_levelbuilder_user}

    # For this test, we'll stub out the S3 interaction
    s3_bucket = @s3_bucket
    Aws::S3::Bucket.stubs(:new).returns(s3_bucket)
    s3_bucket.stubs(:put_object).returns(true)

    post '/api/v1/animation-library/default-spritelab-metadata/production', '{"test":"data"}', {'CONTENT_TYPE' => 'application/json'}
    assert_equal 200, last_response.status
  end

  def test_post_default_metadata_with_regular_user
    # Mock the session using a regular user with no special permissions
    env 'rack.session', {user: @regular_user}

    post '/api/v1/animation-library/default-spritelab-metadata/production', '{"test":"data"}', {'CONTENT_TYPE' => 'application/json'}
    assert_equal 403, last_response.status
  end
end
