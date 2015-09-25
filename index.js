var Receiver = require('ais-receiver');

var receiver = new Receiver({
  udp_port: '29421'
});

receiver.nema.on('message', function (aismsgnum, data) {
  console.log(data);
});

receiver.start();
