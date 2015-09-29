var _ = require('underscore');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

var Format = function (track, type) {
  var formats = {
    linestring: function (track) {
      var coordinates = _.map(track, function (position) {
        return [ position.get('longitude'), position.get('latitude') ]
      });

      return {
        "type": "LineString",
        "coordinates": coordinates
      }
    },
    points: function (track) {
      var features = _.map(track, function (position) {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [ position.get('longitude'), position.get('latitude') ]
          },
          "properties": {
            "userid": position.get('userid'),
            "navigationstatus": position.get('navigationstatus'),
            "positionaccuracy": position.get('positionaccuracy'),
            "rot": position.get('rot'),
            "sog": position.get('sog'),
            "cog": position.get('cog'),
            "trueheading": position.get('trueheading'),
            "timestamp": position.get('timestamp'),
            "datetime": position.get('datetime')
          }
        }
      });

      return {
        "type": "FeatureCollection",
        "features": features
      }
    },
    json: function (track) {
      return _.map(track, function (position) {
        return position.get({ plain: true })
      });
    }
  };
  return (formats[type] || formats['json'])(track);
}

module.exports = function (server, epilogue) {
  server.get('/api/track/:shipid', function (req, res, next) {
    var datetime__greater_than;

    if (req.params.datetime__greater_than) {
      datetime__greater_than = req.params.datetime__greater_than;
    } else {
      var d = new Date();
      d.setDate(d.getDate() - 30);
      datetime__greater_than = d.toISOString();
    }

    Ship.findById(req.params.shipid).then(function (ship) {
      ship.getTrack({
        where: {
          datetime: {
            $gte: datetime__greater_than
          }
        }
      }).then(function (track) {
        res.send(Format(track, req.params.format));
      });
    });

    return next();
  });
}