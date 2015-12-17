var util = require('util');
var EventEmitter = require('events').EventEmitter;

var moment = require('moment');
var _ = require('underscore');

var Redis = require('redis');
var redis = Redis.createClient();

var Scheduler = function () {
  this.timeout = 1;
  this.interval = null;

  this.setMaxListeners(0);
};

util.inherits(Scheduler, EventEmitter);

Scheduler.prototype.ships = function (past, resolve) {
  redis.keys('queue:ship:*', function (err, keys) {
    if (!err) {
      redis.mget(keys, function (err, values) {
        if (!err) {

          if (_.isEmpty(values)) {
            resolve([]);
            return;
          }

          var list = [];
          _.each(values, function (value, index) {
            if (moment(value).isAfter(past)) {
              var mmsi = keys[index].split(':').pop();
              list.push(mmsi);
            }
          });

          var skeys = _.map(list, function (mmsi) {
            return mmsi + ':ship';
          })

          redis.mget(skeys, function (err, shipsdata) {
            var ships = [];

            _.each(shipsdata, function (ship, index) {
              if (ship) {
                ships.push(_.extend({ type: 'ship', mmsi: list[index] }, JSON.parse(ship)));
              }
            });

            resolve(ships);
          });
        } else {
          resolve([]);
        }
      });
    } else {
      resolve([]);
    }
  }.bind(this));
}

Scheduler.prototype.positions = function (past, resolve) {
  redis.keys('queue:positions:*', function (err, keys) {
    if (!err) {
      redis.mget(keys, function (err, values) {
        if (!err) {

          if (_.isEmpty(values)) {
            resolve([]);
            return;
          }

          var list = [];
          _.each(values, function (value, index) {
            if (moment(value).isAfter(past)) {
              var mmsi = keys[index].split(':').pop();
              list.push(mmsi);
            }
          });

          var pkeys = _.map(list, function (mmsi) {
            return mmsi + ':track';
          })

          redis.mget(pkeys, function (err, tracks) {
            var positions = _.map(tracks, function (track, index) {
              return _.extend({ type: 'position', mmsi: list[index] }, JSON.parse(track).pop());
            });

            resolve(positions);
          });
        } else {
          resolve([]);
        }
      });
    } else {
      resolve([]);
    }
  }.bind(this));
}

Scheduler.prototype.process = function () {
  var past = moment().subtract(this.timeout, 'seconds');

  var result = [], c = 0;
  var done = function (res) {
    result = result.concat(res);
    c++;
    if (c == 2) {
      if (!_.isEmpty(result)) {
        this.emit('update', result);
      }
    }
  }.bind(this);

  this.positions(past, done);
  this.ships(past, done);
}

Scheduler.prototype.run = function () {
  this.interval = setInterval(this.process.bind(this), this.timeout * 1000);
}

Scheduler.prototype.stop = function () {
  if (!this.interval) return;

  clearInterval(this.interval);
  this.interval = null;
}

module.exports = Scheduler;
