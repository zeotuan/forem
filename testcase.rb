puts "Process id: #{ Process.pid }"
sleep 9

puts "buckle up, starting rails in one second..."
sleep 1

APP_PATH = File.expand_path('config/application', __dir__)
require APP_PATH
@app = PracticalDeveloper::Application.new
@app.initialize!


puts "The file loaded and rails is ready"
