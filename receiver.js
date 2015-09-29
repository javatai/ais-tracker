"use strict";

var fs = require('fs');
var Receiver = require('ais-receiver');

var filename = __dirname + '/db.ais-messages.sqlite';

if (!fs.existsSync(filename)) {
  console.log('Creating DB: ' + filename);
  fs.openSync(filename, "w");

  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(filename);

  db.run('CREATE TABLE position (id INTEGER PRIMARY KEY, userid INTEGER, navigationstatus INTEGER, rot INTEGER, sog DECIMAL, positionaccuracy INTEGER, longitude DECIMAL, latitude DECIMAL, cog DECIMAL, trueheading DECIMAL, timestamp INTEGER, datetime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, raw TEXT)');
  db.run('CREATE TABLE shipdata (id INTEGER PRIMARY KEY, userid INTEGER, aisversion INTEGER, imonumber INTEGER, callsign TEXT, name TEXT, shiptype INTEGER, dima INTEGER, dimb INTEGER, dimc INTEGER, dimd INTEGER, positiontype INTEGER, etamonth INTEGER, etaday INTEGER, etahour INTEGER, etaminute INTEGER, draught DECIMAL, destination TEXT, dte INTEGER, datetime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, raw TEXT)');
  db.run('CREATE TABLE ship (id INTEGER PRIMARY KEY, userid INTEGER, positionid INTEGER, shipdataid INTEGER, datetime DEFAULT CURRENT_TIMESTAMP NOT NULL)');
  db.run('CREATE TABLE track (positionid INTEGER, shipid INTEGER)');


  db.close();
}

var receiver = new Receiver({
  udp_port: '29421'
});

require('./receiver/position')(receiver);
require('./receiver/ship')(receiver);

receiver.start();
