/*************************************
//
// rolling-diff app
//
**************************************/

var express = require('express'),
    nconf = require('nconf'),

    winston = require('winston');

// take variables first from env
// then from argv then from a file.
nconf.env().argv();
nconf.file('./settings.json');

require('newrelic');

var app = express();
var server = require('http').createServer(app);
var device  = require('express-device');
var io = require('socket.io').listen(server);
var redis = require('redis');






// logger settings
var logLevel = 'info';
if (nconf.get('NODE_ENV') === 'production') {
  logLevel = 'warn';
}

var logger = new (winston.Logger)({
  transports: [new (winston.transports.Console)({level: logLevel})]
});






// express server settings (static assets only)
app.configure(function () {
  'use strict';

  app.use(express.static(__dirname + '/public'));
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.use(device.capture());
});


app.get('/', function (req, res) {
  'use strict';

  res.render('index', {});
});









// socket.io
function pushMessage (pattern, channel, message) {
  'use strict';

  logger.log('info', 'arguments', arguments);
  io.sockets.emit(channel, {query:channel, msg:message});
}


var knownIds = [];

function manageKnownIds (pattern, channel, message) {
  'use strict';

  if (knownIds.indexOf(channel)<0) {
    logger.log('info','added channel');
    knownIds.push(channel);
  }
}


function manageDisconnect () {
  var rc = this;
  logger.log('info', 'disconnect, attempting socket deletion.');
  rc.quit();
  delete socket;
}


io.sockets.on('connection', function (socket) {
  'use strict';

  var url = require("url").parse(nconf.get('REDISCLOUD_URL') || 'localhost:');
  var rc = redis.createClient(url.port, url.hostname, {no_ready_check: true});
  rc.auth(url.auth.split(":")[1]);


  var query = socket.handshake.query || {};
  var listenID = query.id;
  var pattern = 'id:*';

  rc.psubscribe(pattern);
  rc.on('pmessage', pushMessage);
  rc.on('pmessage', manageKnownIds);
  io.sockets.emit('ids', {msg:knownIds});
  socket.on('disconnect', manageDisconnect.bind(rc));
});


server.listen(nconf.get('PORT') || 3000);

