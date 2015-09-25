var _ = require('underscore');
var fs = require('fs');
var Receiver = require('ais-receiver');

var filename = __dirname + '/ais-messages.db';
var exists = fs.existsSync(filename);

if(!exists) {
  console.log('Creating DB: ' + filename);
  fs.openSync(filename, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(filename);

var mapping = {
  position: {
    UserID: 'INTEGER',
    NavigationStatus: 'INTEGER',
    ROT: 'INTEGER',
    SOG: 'NUMERIC',
    PositionAccuracy: 'INTEGER',
    Longitude: 'NUMERIC',
    Latitude: 'NUMERIC',
    COG: 'NUMERIC',
    TrueHeading: 'NUMERIC',
    TimeStamp: 'INTEGER',
    RegionalReserved: 'INTEGER',
    Spare: 'INTEGER',
    RAIM: 'TEXT'
  },
  shipdata: {
    UserID: 'INTEGER',
    AISversion: 'INTEGER',
    IMOnumber: 'INTEGER',
    CallSign: 'TEXT',
    Name: 'TEXT',
    ShipType: 'INTEGER',
    DimA: 'INTEGER',
    DimB: 'INTEGER',
    DimC: 'INTEGER',
    DimD: 'INTEGER',
    PositionType: 'INTEGER',
    ETAmonth: 'INTEGER',
    ETAday: 'INTEGER',
    ETAhour: 'INTEGER',
    ETAminute: 'INTEGER',
    Draught: 'INTEGER',
    Destination: 'TEXT',
    DTE: 'INTEGER'
  }
}

var receiver = new Receiver({
  udp_port: '29421'
});

// receiver.nema.on('message', function (aismsgnum, data) {
//   console.log(data);
// });

var insert_data = function (tablename, res) {
  var data = [];
  _.each(mapping[tablename], function (type, column) {
    data.push(res.message[column]);
  });
  data.push(res.timestamp);
  data.push(JSON.stringify(res.ais));

  db.run('INSERT INTO ' + tablename + ' VALUES (null' + (new Array(data.length + 1).join(', ?')) + ')', data);
}

db.serialize(function() {
  if (!exists) {
    var columns;
    _.each(mapping, function (spects, tablename) {
      columns = [ 'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL' ];
      _.each(spects, function (type, column) {
        columns.push(column.toLowerCase() + ' ' + type);
      });
      columns.push('datetime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL');
      columns.push('raw TEXT');

      db.run('CREATE TABLE ' + tablename + ' (' + columns.join(', ') + ')');
    });
  }

  receiver.nema.on('message:position', function (res) {
    if (_.isNull(res.message.Latitude) || _.isNull(res.message.Longitude)) {
      return;
    }
    insert_data('position', res);
  });

  receiver.nema.on('message:shipdata', function (res) {
    insert_data('shipdata', res);
  });

  receiver.start();
});
