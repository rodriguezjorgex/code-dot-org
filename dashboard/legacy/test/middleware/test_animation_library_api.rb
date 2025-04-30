require_relative 'middleware_test_helper'
require_relative '../../middleware/animation_library_api'

class AnimationLibraryTest < Minitest::Test
  include Rack::Test::Methods
  include SetupTest

  def build_rack_mock_session
    @session = Rack::MockSession.new(AnimationLibraryApi, 'studio.code.org')
  end

  def test_animation_not_found
    get '/api/v1/animation-library/spritelab/version/animation_not_found.png'
    assert last_response.not_found?
  end

  def test_get_spritelab_animation
    contents = 'TEST_ANIMATION'
    # Ensure the shared S3 client is used by stubbing the client with the expected response.
    AWS::S3.s3 = Aws::S3::Client.new(
      stub_responses: {
        get_object: {body: contents, content_type: 'image/png'}
      }
    )
    get '/api/v1/animation-library/spritelab/version/test_animation.png'
    assert last_response.ok?
    assert_equal contents, last_response.body
  ensure
    AWS::S3.s3 = nil
  end

  # POST endpoints require both admin and levelbuilder privileges.
  def test_post_level_animations_forbidden_without_authorization
    post '/api/v1/animation-library/level_animations/test.png', 'DATA', 'CONTENT_TYPE' => 'image/png'
    assert last_response.forbidden?
  end

  def test_post_level_animations_forbidden_for_admin_only
    AnimationLibraryApi.any_instance.stubs(:admin?).returns(true)
    AnimationLibraryApi.any_instance.stubs(:has_permission?).with('levelbuilder').returns(false)
    post '/api/v1/animation-library/level_animations/test.png', 'DATA', 'CONTENT_TYPE' => 'image/png'
    assert last_response.forbidden?
  end

  def test_post_level_animations_forbidden_for_levelbuilder_only
    AnimationLibraryApi.any_instance.stubs(:admin?).returns(false)
    AnimationLibraryApi.any_instance.stubs(:has_permission?).with('levelbuilder').returns(true)
    post '/api/v1/animation-library/level_animations/test.png', 'DATA', 'CONTENT_TYPE' => 'image/png'
    assert last_response.forbidden?
  end

  def test_post_level_animations_success_for_admin_and_levelbuilder
    AnimationLibraryApi.any_instance.stubs(:admin?).returns(true)
    AnimationLibraryApi.any_instance.stubs(:has_permission?).with('levelbuilder').returns(true)
    Aws::S3::Bucket.any_instance.stubs(:put_object)
    post '/api/v1/animation-library/level_animations/test.png', 'DATA', 'CONTENT_TYPE' => 'image/png'
    assert last_response.ok?
  end

  def test_post_spritelab_forbidden_without_authorization
    post '/api/v1/animation-library/spritelab/cat/test.png', 'DATA', 'CONTENT_TYPE' => 'image/png'
    assert last_response.forbidden?
  end

  def test_post_spritelab_success_for_admin_and_levelbuilder
    AnimationLibraryApi.any_instance.stubs(:admin?).returns(true)
    AnimationLibraryApi.any_instance.stubs(:has_permission?).with('levelbuilder').returns(true)
    Aws::S3::Bucket.any_instance.stubs(:put_object)
    post '/api/v1/animation-library/spritelab/cat/test.png', 'DATA', 'CONTENT_TYPE' => 'image/png'
    assert last_response.ok?
  end

  def test_post_default_spritelab_metadata_forbidden_without_authorization
    post '/api/v1/animation-library/default-spritelab-metadata/production',
         '{"foo":"bar"}', 'CONTENT_TYPE' => 'application/json'
    assert last_response.forbidden?
  end

  def test_post_default_spritelab_metadata_success_for_admin_and_levelbuilder
    AnimationLibraryApi.any_instance.stubs(:admin?).returns(true)
    AnimationLibraryApi.any_instance.stubs(:has_permission?).with('levelbuilder').returns(true)
    Aws::S3::Bucket.any_instance.stubs(:put_object)
    post '/api/v1/animation-library/default-spritelab-metadata/levelbuilder',
         '{"foo":"bar"}', 'CONTENT_TYPE' => 'application/json'
    assert last_response.ok?
  end

  def test_get_gamelab_animation
    contents = 'TEST_ANIMATION'
    # Ensure the shared S3 client is used by stubbing the client with the expected response.
    AWS::S3.s3 = Aws::S3::Client.new(
      stub_responses: {
        get_object: {body: contents, content_type: 'image/png'}
      }
    )
    get '/api/v1/animation-library/gamelab/version/test_animation.png'
    assert last_response.ok?
    assert_equal contents, last_response.body
  ensure
    AWS::S3.s3 = nil
  end

  def test_get_spritelab_manifest
    contents = 'TEST_MANIFEST'
    # Ensure the shared S3 client is used by stubbing the client with the expected response.
    AWS::S3.s3 = Aws::S3::Client.new(
      stub_responses: {
        get_object: {body: contents, content_type: 'json'}
      }
    )
    get '/api/v1/animation-library/manifest/spritelab/en_us'
    assert last_response.ok?
    assert_equal contents, last_response.body
  ensure
    AWS::S3.s3 = nil
  end

  def test_not_found
    get '/api/v1/animation-library/animation_not_found.png'
    assert last_response.not_found?
    get '/api/v1/animation-library/xyz/'
    assert last_response.not_found?
  end

  def test_get_animation
    contents = 'TEST_ANIMATION'
    # Ensure the shared S3 client is used by stubbing the client with the expected response.
    AWS::S3.s3 = Aws::S3::Client.new(
      stub_responses: {
        get_object: {body: contents, content_type: 'image/png'}
      }
    )
    get '/api/v1/animation-library/version/test_animation.png'
    assert last_response.ok?
    assert_equal contents, last_response.body
  ensure
    AWS::S3.s3 = nil
  end
end
