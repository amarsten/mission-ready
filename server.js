var express = require('express')
morgan = require('morgan')
fs = require('fs')
path = require('path')
multer = require('multer')
ffmpeg = require('ffmpeg')
bodyParser = require('body-parser');


// This app uses the expressjs framework
app = express();

// Boilerplate for setting up socket.io alongside Express.
var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer);
require('./models/serverSocket.js').init(io);
socket = require('./models/serverSocket.js');
// Set the views directory
app.set('views', __dirname + '/views');
// Define the view (templating) engine
app.set('view engine', 'jade');
// Define how to log events
app.use(morgan('dev'));
app.use(bodyParser({limit: '50mb'}));

// Handle static files
app.use(express.static(__dirname + '/public'));


// Load all routes in the routes directory
fs.readdirSync('./routes').forEach(function(file) {
  // There might be non-js files in the directory that should not be loaded
  if (path.extname(file) == '.js') {
    console.log("Adding routes in " + file);
    require('./routes/' + file).init(app);
  }
});


// Catch any routes not already handed with an error message
app.use(function(req, res) {
  var message = 'Error, did not understand path ' + req.path;
  // Set the status to 404 not found, and render a message to the user.
  res.status(404).render('error', {
    'message': message
  });
});


ipaddress = "127.0.0.1";
port = 50000;




//  Start listening on the specific IP and PORT

httpServer.listen(port, ipaddress, function() {
  console.log('\n\n~~~ENTERING THE KINETIC DOMAIN~~~\n\n     ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨\n          %s:%d\n     ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨\n\n', ipaddress, port);
});