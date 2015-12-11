"use strict";

// SELECT p1.
// FROM position p1
// INNER JOIN
// (
//     SELECT max(datetime) MaxDateTime, userid
//     FROM position
//     WHERE datetime >= '2015-12-09T21:36:18.080Z'
//       AND (longitude <= 9.965961768728562 AND longitude >= 9.947920073299088)
//       AND (latitude <= 53.547720526726465 AND latitude >= 53.538509989468395)
//     GROUP BY userid
// ) p2
//   ON p1.userid = p2.userid
//   AND p1.datetime = p2.MaxDateTime
// WHERE
//   datetime >= '2015-12-09T21:36:18.080Z'
// ORDER BY p1.datetime desc

var ferries = require('../api/hamburg-ferries.json');

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var _ = require('underscore');
var events = require('../lib/events');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

var findoneShip = require('../lib/findone-ship');

var sequelize = require('../lib/init');

var Listener = function (socket) {
  this.socket = socket;

  socket.emit('connected', { id: socket.id });

  this.refresh();
  this.timer = setInterval(this.refresh.bind(this), 10000);
}

Listener.prototype = {
  bounds: null,
  datetime: null,
  timer: null,

  query: function (q, name) {
    var socket = this.socket;

    sequelize.query(q, { type: sequelize.QueryTypes.SELECT})
      .then(function(positions) {
        var q = {
          include: [
            { model: ShipData, as: 'shipdata' },
            { model: Position, as: 'position' }
          ],
          where: {
            positionid: {
              $in: _.map(positions, function (position) {
                return position.id;
              })
            }
          }
        }

        Ship.findAll(q).then(function (ships) {
          socket.emit(name, _.map(ships, function (ship) {
            var json = ship.toJSON();

            delete json.shipdataid;
            delete json.positionid;

            if (json.shipdata) {
              json.shipdata.raw = JSON.parse(json.shipdata.raw);
            }

            if (json.position) {
              json.position.raw = JSON.parse(json.position.raw);
            }

            return json;
          }));
        });
      });
  },

  refresh: function () {
    this.datetime = new Date();
    this.datetime.setMinutes(this.datetime.getMinutes() - config.setup.ship.minutes);

    var q = "SELECT p1.id"
    + " FROM position p1"
    + " INNER JOIN"
    + " ("
    + "     SELECT max(datetime) MaxDateTime, userid"
    + "     FROM position"
    + "     WHERE datetime >= '" + this.datetime.toISOString() + "'"
    + "     GROUP BY userid"
    + " ) p2"
    + "   ON p1.userid = p2.userid"
    + "   AND p1.datetime = p2.MaxDateTime"
    + " WHERE"
    + "   p1.datetime >= '" + this.datetime.toISOString() + "'"
    + " ORDER BY p1.datetime desc";

    this.query(q, 'refresh');
  },

  onTrackAdd: function (json) {
    this.socket.emit('track:add:' + json.userid, {
      shipname: json.shipname,
      position: json.position
    });
    this.socket.emit('track:add', json);
  },

  connect: function () {
    events.on('track:add', this.onTrackAdd.bind(this));
  },

  disconnect: function () {
    events.removeListener('track:add', this.onTrackAdd.bind(this));
  }
};

module.exports = Listener;
