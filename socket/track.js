var util = require('util');
var EventEmitter = require('events').EventEmitter;

var _ = require('underscore');

var Redis = require('redis');
var redis = Redis.createClient();

var Track = function () { };

util.inherits(Track, EventEmitter);

Track.prototype.fetch = function (mmsi, resolve) {
  redis.get(mmsi + ':track', function (err, positions) {
    if (!err) {
      resolve(JSON.parse(positions));
    } else {
      resolve([]);
    }
  });
};

module.exports = Track;
