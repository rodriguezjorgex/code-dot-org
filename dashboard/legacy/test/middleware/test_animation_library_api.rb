require 'minitest/autorun'
require 'rack/test'
require_relative '../../middleware/animation_library_api'

# Skip loading middleware_test_helper which tries to connect to the database
# require_relative 'middleware_test_helper'

class AnimationLibraryTest < Minitest::Test
  include Rack::Test::Methods
  
  # Remove the SetupTest module which relies on database connectivity
  # include SetupTest
  
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
  end

  def teardown
    AWS::S3.s3 = nil
  end

  # Rest of the test methods remain the same
  def test_animation_not_found
    get '/api/v1/animation-library/spritelab/version/animation_not_found.png'
    assert last_response.not_found?
  end

  def test_get_spritelab_animation
    contents = 'TEST_ANIMATION'
    # Configure the mock response
    resp = { body: contents, content_type: 'image/png' }
    @s3_client.expect :get_object, resp, [{ bucket: AnimationLibraryApi::ANIMATION_LIBRARY_BUCKET, key: 'spritelab/version/test_animation.png' }]
    AWS::S3.s3 = @s3_client
    
    get '/api/v1/animation-library/spritelab/version/test_animation.png'
    assert last_response.ok?
    assert_equal contents, last_response.body
  end

  def test_get_gamelab_animation
    contents = 'TEST_ANIMATION'
    # Configure the mock response
    resp = { body: contents, content_type: 'image/png' }
    @s3_client.expect :get_object, resp, [{ bucket: AnimationLibraryApi::ANIMATION_LIBRARY_BUCKET, key: 'gamelab/version/test_animation.png' }]
    AWS::S3.s3 = @s3_client
    
    get '/api/v1/animation-library/gamelab/version/test_animation.png'
    assert last_response.ok?
    assert_equal contents, last_response.body
  end

  def test_get_spritelab_manifest
    contents = 'TEST_MANIFEST'
    # Configure the mock response
    resp = { body: contents, content_type: 'json' }
    @s3_client.expect :get_object, resp, [{ bucket: AnimationLibraryApi::ANIMATION_LIBRARY_BUCKET, key: 'manifest/spritelab/en_us' }]
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
    resp = { body: contents, content_type: 'image/png' }
    @s3_client.expect :get_object, resp, [{ bucket: AnimationLibraryApi::ANIMATION_LIBRARY_BUCKET, key: 'version/test_animation.png' }]
    AWS::S3.s3 = @s3_client
    
    get '/api/v1/animation-library/version/test_animation.png'
    assert last_response.ok?
    assert_equal contents, last_response.body
  end
  
  # Test cases for authentication requirements
  
  def test_post_level_animations_with_no_user
    # Attempt to upload with no user in session
    post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', { 'CONTENT_TYPE' => 'image/png' }
    assert_equal 403, last_response.status
  end
  
  def test_post_level_animations_with_admin_user
    # Create a mock user with admin permissions
    mock_user = Object.new
    def mock_user.admin?; true; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; false; end
    
    # Mock the session
    env 'rack.session', { user: mock_user }
    
    # For this test, we'll stub out the S3 interaction
    Aws::S3::Bucket.stub :new, @s3_bucket do
      def @s3_bucket.put_object(*args); true; end
      
      post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', { 'CONTENT_TYPE' => 'image/png' }
      assert_equal 200, last_response.status
    end
  end
  
  def test_post_level_animations_with_staff_user
    # Create a mock user with staff permissions
    mock_user = Object.new
    def mock_user.admin?; false; end
    def mock_user.site_admin?; true; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; false; end
    
    # Mock the session
    env 'rack.session', { user: mock_user }
    
    # For this test, we'll stub out the S3 interaction
    Aws::S3::Bucket.stub :new, @s3_bucket do
      def @s3_bucket.put_object(*args); true; end
      
      post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', { 'CONTENT_TYPE' => 'image/png' }
      assert_equal 200, last_response.status
    end
  end
  
  def test_post_level_animations_with_levelbuilder_user
    # Create a mock user with levelbuilder permissions
    mock_user = Object.new
    def mock_user.admin?; false; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; true; end
    def mock_user.facilitator?; false; end
    
    # Mock the session
    env 'rack.session', { user: mock_user }
    
    # For this test, we'll stub out the S3 interaction
    Aws::S3::Bucket.stub :new, @s3_bucket do
      def @s3_bucket.put_object(*args); true; end
      
      post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', { 'CONTENT_TYPE' => 'image/png' }
      assert_equal 200, last_response.status
    end
  end
  
  def test_post_level_animations_with_facilitator_user
    # Create a mock user with facilitator permissions
    mock_user = Object.new
    def mock_user.admin?; false; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; true; end
    
    # Mock the session
    env 'rack.session', { user: mock_user }
    
    # For this test, we'll stub out the S3 interaction
    Aws::S3::Bucket.stub :new, @s3_bucket do
      def @s3_bucket.put_object(*args); true; end
      
      post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', { 'CONTENT_TYPE' => 'image/png' }
      assert_equal 200, last_response.status
    end
  end
  
  def test_post_level_animations_with_regular_user
    # Create a mock user with no special permissions
    mock_user = Object.new
    def mock_user.admin?; false; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; false; end
    
    # Mock the session
    env 'rack.session', { user: mock_user }
    
    post '/api/v1/animation-library/level_animations/test_animation.png', 'TEST_DATA', { 'CONTENT_TYPE' => 'image/png' }
    assert_equal 403, last_response.status
  end
  
  def test_post_spritelab_with_admin_user
    # Create a mock user with admin permissions
    mock_user = Object.new
    def mock_user.admin?; true; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; false; end
    
    # Mock the session
    env 'rack.session', { user: mock_user }
    
    # For this test, we'll stub out the S3 interaction
    Aws::S3::Bucket.stub :new, @s3_bucket do
      def @s3_bucket.put_object(*args); true; end
      
      post '/api/v1/animation-library/spritelab/animals/test_animation.png', 'TEST_DATA', { 'CONTENT_TYPE' => 'image/png' }
      assert_equal 200, last_response.status
    end
  end
  
  def test_post_default_metadata_with_admin_user
    # Create a mock user with admin permissions
    mock_user = Object.new
    def mock_user.admin?; true; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; false; end
    
    # Mock the session
    env 'rack.session', { user: mock_user }
    
    # For this test, we'll stub out the S3 interaction
    Aws::S3::Bucket.stub :new, @s3_bucket do
      def @s3_bucket.put_object(*args); true; end
      
      post '/api/v1/animation-library/default-spritelab-metadata/production', '{"test":"data"}', { 'CONTENT_TYPE' => 'application/json' }
      assert_equal 200, last_response.status
    end
  end
  
  def test_post_default_metadata_with_regular_user
    # Create a mock user with no special permissions
    mock_user = Object.new
    def mock_user.admin?; false; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; false; end
    
    # Mock the session
    env 'rack.session', { user: mock_user }
    
    post '/api/v1/animation-library/default-spritelab-metadata/production', '{"test":"data"}', { 'CONTENT_TYPE' => 'application/json' }
    assert_equal 403, last_response.status
  end
end
