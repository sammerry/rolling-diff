var redis = require("redis"),
    client = redis.createClient();

setInterval(function () {
  var msg = Math.random();
  var pid = parseInt(Math.random() *10);
  console.log(pid, msg);

  client.publish('obd:123', 1234+msg);
  client.publish('obd:321', 4321+msg);

}, 100);

setInterval(function () {
  client.publish('ids', ['123', '321'])
}, 1000);
