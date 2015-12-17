var util = require('util');
var EventEmitter = require('events').EventEmitter;

var _ = require('underscore');

var Redis = require('redis');
var redis = Redis.createClient();

var InitClient = function () { };

util.inherits(InitClient, EventEmitter);

InitClient.prototype.fetch = function () {
  var result = [], c = 0;
  var done = function (res) {
    result = result.concat(res);
    c++;
    if (c == 2) {
      if (!_.isEmpty(result)) {
        this.emit('init', result);
      }
    }
  }.bind(this);

  this.fetchPositions(done);
};

InitClient.prototype.fetchShips = function (list, resolve) {
  var keys = _.map(list, function (mmsi) {
    return mmsi + ':ship';
  });

  redis.mget(keys, function (err, items) {
    if (!err) {
      var ships = [];

      _.each(items, function (ship, index) {
        if (!_.isEmpty(ship)) {
          ships.push(_.extend({ type: 'ship', mmsi: list[index] }, JSON.parse(ship)));
        }
      });

      resolve(ships);
    } else {
      resolve([]);
    }
  });
}

InitClient.prototype.fetchPositions = function (resolve) {
  redis.keys('*:track', function (err, keys) {
    if (!err) {
      var list = [];
      _.each(keys, function (key, index) {
        var mmsi = _.first(key.split(':'));
        list.push(mmsi);
      });

      this.fetchShips(list, resolve);

      redis.mget(keys, function (err, tracks) {
        if (!err) {
          var positions = _.map(tracks, function (track, index) {
            var position = _.last(track);
            return _.extend({ type: 'position', mmsi: list[index] }, JSON.parse(track).pop());
          });

          resolve(positions);
        } else {
          resolve([]);
        }
      });
    } else {
      resolve([]);
    }
  }.bind(this));
}

module.exports = InitClient;