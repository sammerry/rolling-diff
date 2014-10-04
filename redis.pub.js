var redis = require('redis'),
    client = redis.createClient();

setInterval(function () {
  'use strict';

  var msg = Math.random();
  var id = 'id:'+parseInt(Math.random() *10);
  console.log(id, msg);

  client.publish(id, 1234+msg);
}, 100);
