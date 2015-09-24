var Receiver = require('ais-receiver');

console.log(receiver);

var receiver = new Receiver({
  udp_port: '29421'
});

var nema = receiver.start();

nema.on('message', function (aismsgnum, data) {
  console.log(data);
});
