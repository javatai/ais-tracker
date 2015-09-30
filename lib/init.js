"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var Sequelize = require('sequelize');
var sequelize = new Sequelize('', '', '', config);

var fs = require('fs');
var filename = __dirname + '/../db.ais-messages.sqlite';

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

module.exports = sequelize;