/*************************************
//
// rolling-diff app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var device  = require('express-device');

var io = require('socket.io').listen(server);
var redis = require('redis');

// var runningPortNumber = process.env.PORT;


app.configure(function () {
  'use strict';

  // I need to access everything in '/public' directly
  app.use(express.static(__dirname + '/public'));

  //set the view engine
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');

  app.use(device.capture());
});


app.get('/', function (req, res) {
  'use strict';

  res.render('index', {});
});










function pushMessage (pattern, channel, message) {
  'use strict';

  console.log(arguments);
  io.sockets.emit(channel, {query:channel, msg:message});
}





var knownIds = [];

function manageKnownIds (pattern, channel, message) {
  'use strict';

  if (knownIds.indexOf(channel)<0) {
    console.log('added channel')
    knownIds.push(channel);
  }
}




function manageDisconnect () {
  var rc = this;
  console.log('disconnect, attempting socket deletion.');
  rc.quit();
  delete socket;
}


io.sockets.on('connection', function (socket) {
  'use strict';

  var rc = redis.createClient();
  var query = socket.handshake.query || {};
  var listenID = query.id;
  var pattern = 'id:*';

  rc.psubscribe(pattern);
  rc.on('pmessage', pushMessage);
  rc.on('pmessage', manageKnownIds);
  io.sockets.emit('ids', {msg:knownIds});
  socket.on('disconnect', manageDisconnect.bind(rc));
});




server.listen(3000);

