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
  // I need to access everything in '/public' directly
  app.use(express.static(__dirname + '/public'));

  //set the view engine
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');

  app.use(device.capture());
});


app.get('/', function (req, res) {
  res.render('index', {});
});





var knownPids = [];





function pushMessage (channel, message) {
  var pid = channel.split(':')[1];
  console.log(pid)
  io.sockets.emit(pid.toString(), {query:pid, msg:message});
}





function manageKnownIds (channel, message) {
  var pid = channel.split(':')[1];
  if (knownPids.indexOf(pid)<0) {
    knownPids.push(pid.toString());
  }
}





function manageDisconnect () {
  var rc = this;
  console.log('disconnect, attempting socket deletion.');
  rc.quit();
  delete socket;
}



var pidClient = redis.createClient();
pidClient.subscribe('ids');
pidClient.on('message', function (channel, message) {
  io.sockets.emit('pids', {msg:message.split(',')});
});



io.sockets.on('connection', function (socket) {
  var rc = redis.createClient();
  var query = socket.handshake.query || {};
  var listenID = query.pid;
  var pattern = 'obd:' + listenID;

  rc.subscribe(pattern);
  rc.addListener('message', pushMessage);
  rc.on('message', manageKnownIds);
  socket.on('disconnect', manageDisconnect.bind(rc));
});




server.listen(3000);

