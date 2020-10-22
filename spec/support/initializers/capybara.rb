require "capybara/rails"
require "capybara/rspec"
require "webdrivers/chromedriver"

Webdrivers.cache_time = 86_400

Capybara.default_max_wait_time = 10

RSpec.configure do |config|
  Capybara.register_driver :selenium_chrome_headless do |app|
    caps = Selenium::WebDriver::Remote::Capabilities.chrome(
      loggingPrefs: { browser: "ALL" },
    )
    browser_options = ::Selenium::WebDriver::Chrome::Options.new
    browser_options.args << "--no-sandbox"
    browser_options.args << "--window-size=1400,2000"
    browser_options.args << "--disable-dev-shm-usage"
    browser_options.args << "--disable-notifications"
    browser_options.args << "--disable-site-isolation-trials"
    browser_options.headless!

    Capybara::Selenium::Driver.new(app, browser: :chrome, options: browser_options, desired_capabilities: caps)
  end

  config.before(:each, type: :system) do
    driven_by :rack_test
  end

  config.before(:each, type: :system, js: true) do
    if ENV["SELENIUM_URL"].present?
      Capybara.server_port = ENV['TEST_APP_PORT'].to_i
      Capybara.app_host = "http://#{ENV['TEST_APP_HOST']}:#{ENV['TEST_APP_PORT']}"
      Capybara.server_host = '0.0.0.0'

      Capybara::Selenium::Driver.new app,
        url: ENV['SELENIUM_HUB_URL'],
        browser: :remote,
        desired_capabilities: Selenium::WebDriver::Remote::Capabilities.chrome(
          chromeOptions: { args: %w(headless disable-gpu) }
        )

      driven_by :headless_chrome, screen_size: [1400, 2000]
    else
      # options from https://github.com/teamcapybara/capybara#selenium
      chrome = ENV["HEADLESS"] == "false" ? :selenium_chrome : :selenium_chrome_headless
      driven_by chrome
      Capybara.javascript_driver = chrome
    end
  end
end

# adapted from <https://medium.com/doctolib-engineering/hunting-flaky-tests-2-waiting-for-ajax-bd76d79d9ee9>
def wait_for_javascript
  max_time = Capybara::Helpers.monotonic_time + Capybara.default_max_wait_time
  finished = false

  while Capybara::Helpers.monotonic_time < max_time
    finished = page.evaluate_script("typeof initializeBaseApp") != "undefined"

    break if finished

    sleep 0.1
  end

  raise "wait_for_javascript timeout" unless finished
end
