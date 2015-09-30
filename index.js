var sequelize = require('./lib/init');

var receiver = require('./receiver');
var server = require('./server');

sequelize
  .sync({ force: false })
  .then(function() {

    receiver.start();

    server.listen(3000, function() {
      var host = server.address().address,
          port = server.address().port;

      console.log('listening at http://%s:%s', host, port);
    });

  });