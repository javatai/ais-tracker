"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var _ = require('underscore');
var moment = require('moment');
var Position = require('../models/position');
var GeographicLib = require("geographiclib");

var geod = GeographicLib.Geodesic.WGS84;
var LngLat = config.setup.reception.distancefrom;

var iterate = function (req, res, options) {
  var q = {
    limit: options.limit,
    offset: options.offset,
    order: 'id ASC'
  };

  if (req.query.datetime__greater_than && req.query.datetime__lesser_than) {
    q.where = {
      datetime: {
        $gte: req.query.datetime__greater_than,
        $lte: req.query.datetime__lesser_than
      }
    };
  } else {
    var data = { }, today = moment().utc();

    today.utc().startOf('day');
    data.datetime__greater_than = today.utc().format();

    today.utc().endOf('day');
    data.datetime__lesser_than = today.utc().format();

    q.where = {
      datetime: {
        $gte: data.datetime__greater_than,
        $lte: data.datetime__lesser_than
      }
    };
  }

  Position.findAll(q).then(function(positions) {
    var c = positions.length;
    _.each(positions, function (position) {
      options.count++;
      var geo = geod.Inverse(LngLat.lat, LngLat.lng, position.get('latitude'), position.get('longitude'));
      var a = Math.round(geo.azi2);
      if (a < 0) {
        a = 360 + a;
      }
      if (!options.distances[a] || options.distances[a] < geo.s12) {
        options.distances[a] = geo.s12;
      }
      if (!options.startdatetime || moment.utc(position.get('datetime')).isBefore(moment.utc(options.startdatetime))) {
        options.startdatetime = position.get('datetime');
      }
      if (!options.enddatetime || moment.utc(position.get('datetime')).isAfter(moment.utc(options.enddatetime))) {
        options.enddatetime = position.get('datetime');
      }
    });

    if (options.limit === c && (options.stop < 1 || options.num < options.stop)) {
      options.offset = options.offset + options.limit;
      options.num++;
      iterate(req, res, options);
    } else {
      var endtime = moment.utc()
      var diff = endtime.diff(options.starttime, 'seconds');

      var geometry = {
        "type": "Polygon",
        "coordinates": [[  ]],
        "properties": {
          'duration': diff,
          'from': options.startdatetime,
          'to': options.enddatetime,
          'count': options.count,
          'distances': { }
        }
      }

      for (var i=0; i <= 360; i++) {
        var d;
        if (options.distances[i]) {
          geometry.properties.distances[i] = options.distances[i];

          d = geod.Direct(LngLat.lat, LngLat.lng, i-0.5, options.distances[i]);
          geometry.coordinates[0].push([ d.lon2, d.lat2 ]);

          d = geod.Direct(LngLat.lat, LngLat.lng, i+0.5, options.distances[i]);
          geometry.coordinates[0].push([ d.lon2, d.lat2 ]);
        } else {
          d = {
            lat2: LngLat.lat,
            lon2: LngLat.lng
          }
          geometry.coordinates[0].push([ d.lon2, d.lat2 ]);
        }
      }

      res.send(geometry);
    }
  });
}

module.exports = function (server) {
  server.get('/api/reception', function (req, res, next) {
    var options = {
      starttime: moment.utc(),
      startdatetime: 0,
      enddatetime: 0,
      distances: [],
      limit: 100000,
      stop: 0,
      num: 1,
      offset: 0,
      count: 0
    }

    iterate(req, res, options);
  });
}
