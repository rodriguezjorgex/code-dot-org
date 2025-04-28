require 'minitest/autorun'

# We'll extract just the authentication helper method for testing
module AnimationLibraryAuthHelper
  def authenticate_animation_library_request!
    return true if request && request.env && request.env['rack.session'] && request.env['rack.session']['user'] &&
                  request.env['rack.session']['user'].admin? &&
                    request.env['rack.session']['user'].levelbuilder?
    halt 403, 'Forbidden'
  end
  
  def halt(status, message)
    @halted = {status: status, message: message}
    throw :halt
  end
  
  attr_reader :halted, :request
end

class AnimationLibraryAuthTest < Minitest::Test
  include AnimationLibraryAuthHelper
  
  def setup
    @halted = nil
  end
  
  def test_authenticate_animation_library_request_with_no_user
    @request = nil
    assert_raises(UncaughtThrowError) { authenticate_animation_library_request! }
    assert_equal 403, @halted[:status]
  end
  
  def test_authenticate_animation_library_request_with_no_session
    @request = Object.new
    def @request.env; {}; end
    
    assert_raises(UncaughtThrowError) { authenticate_animation_library_request! }
    assert_equal 403, @halted[:status]
  end
  
  def test_authenticate_animation_library_request_with_empty_session
    @request = Object.new
    def @request.env; {'rack.session' => {}}; end
    
    assert_raises(UncaughtThrowError) { authenticate_animation_library_request! }
    assert_equal 403, @halted[:status]
  end
  
  def test_authenticate_animation_library_request_with_only_admin_user
    # This test now expects admin-only users to be rejected
    mock_user = Object.new
    def mock_user.admin?; true; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; false; end
    
    @request = Object.new
    @request.define_singleton_method(:env) do
      {'rack.session' => {'user' => mock_user}}
    end
    
    # Admin-only user should now be rejected
    assert_raises(UncaughtThrowError) { authenticate_animation_library_request! }
    assert_equal 403, @halted[:status]
  end
  
  def test_authenticate_animation_library_request_with_only_site_admin_user
    # This test now expects site_admin-only users to be rejected
    mock_user = Object.new
    def mock_user.admin?; false; end
    def mock_user.site_admin?; true; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; false; end
    
    @request = Object.new
    @request.define_singleton_method(:env) do
      {'rack.session' => {'user' => mock_user}}
    end
    
    # Site admin-only user should now be rejected
    assert_raises(UncaughtThrowError) { authenticate_animation_library_request! }
    assert_equal 403, @halted[:status]
  end
  
  def test_authenticate_animation_library_request_with_only_levelbuilder_user
    # This test now expects levelbuilder-only users to be rejected
    mock_user = Object.new
    def mock_user.admin?; false; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; true; end
    def mock_user.facilitator?; false; end
    
    @request = Object.new
    @request.define_singleton_method(:env) do
      {'rack.session' => {'user' => mock_user}}
    end
    
    # Levelbuilder-only user should now be rejected
    assert_raises(UncaughtThrowError) { authenticate_animation_library_request! }
    assert_equal 403, @halted[:status]
  end
  
  def test_authenticate_animation_library_request_with_only_facilitator_user
    # This test now expects facilitator-only users to be rejected
    mock_user = Object.new
    def mock_user.admin?; false; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; true; end
    
    @request = Object.new
    @request.define_singleton_method(:env) do
      {'rack.session' => {'user' => mock_user}}
    end
    
    # Facilitator-only user should now be rejected
    assert_raises(UncaughtThrowError) { authenticate_animation_library_request! }
    assert_equal 403, @halted[:status]
  end
  
  def test_authenticate_animation_library_request_with_admin_and_levelbuilder_user
    # This test checks for a user with BOTH admin AND levelbuilder privileges
    mock_user = Object.new
    def mock_user.admin?; true; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; true; end
    def mock_user.facilitator?; false; end
    
    @request = Object.new
    @request.define_singleton_method(:env) do
      {'rack.session' => {'user' => mock_user}}
    end
    
    # User with both admin AND levelbuilder should be allowed
    result = authenticate_animation_library_request!
    assert result
    assert_nil @halted
  end
  
  def test_authenticate_animation_library_request_with_regular_user
    mock_user = Object.new
    def mock_user.admin?; false; end
    def mock_user.site_admin?; false; end
    def mock_user.levelbuilder?; false; end
    def mock_user.facilitator?; false; end
    
    @request = Object.new
    @request.define_singleton_method(:env) do
      {'rack.session' => {'user' => mock_user}}
    end
    
    assert_raises(UncaughtThrowError) { authenticate_animation_library_request! }
    assert_equal 403, @halted[:status]
  end
end