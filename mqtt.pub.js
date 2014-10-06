var mqtt = require('mqtt');
var client = mqtt.createClient(1883, 'ec2-54-183-138-254.us-west-1.compute.amazonaws.com')


  .subscribe('id:1')


  .on('connect', function(packet) {
    'use strict';
    console.log(packet);
  })


  .on('message', function (topic, message) {
    'use strict';
    console.log(arguments);
  })


  .on('error', function(err) {
    'use strict';
    console.log('error!', err);

    if (!self.clients[client.id]) return;
    delete self.clients[client.id];
    client.stream.end();
  });


setInterval(function () {
  'use strict';

  var msg = Math.random();
  var id = 'id:'+parseInt(Math.random() *10);
  // console.log('created: ', id, msg);
  client.publish( id, ''+1234+msg);

}, 200);

