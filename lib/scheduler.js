var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var _ = require('underscore');

var Redis = require('redis');
var redis = Redis.createClient(config.redis);

var Scheduler = function (ws) {
  this.sid = ws.id;
  this.ws = ws;

  redis.keys('data:*:ship', function (err, keys) {
    redis.set('client:' + this.sid, JSON.stringify({ datetime: moment.utc().toISOString() }));

    if (!err && !_.isEmpty(keys)) {
      redis.mget(keys, function (err, result) {
        if (!err) {
          result = _.map(_.without(result, null), function (item) {
            return JSON.parse(item);
          });
          this.ws.emit('init', result);

          this.interval = setInterval(this.process.bind(this), 1000);
        } else {
          this.ws.emit('error', err);
        }
      }.bind(this));
    } else if (_.isEmpty(keys)) {
      this.ws.emit('init', []);
    } else {
      this.ws.emit('error', er);
    }
  }.bind(this));
};

Scheduler.prototype = {
  track: function (mmsi) {
    redis.mget('data:' + mmsi + ':track', function (err, result) {
      if (!err && result) {
        try {
          this.ws.emit('track:' + mmsi, JSON.parse(result));
        } catch (ex) {
          console.log(result);
        }
      } else if (!result) {
        this.ws.emit('track:' + mmsi, []);
      } else {
        this.ws.emit('error', err);
      }
    }.bind(this));
  },

  process: function () {
    redis.keys('queue:' + this.sid + ':*', function (err, keys) {
      if (!err && !_.isEmpty(keys)) {
        redis.mget(keys, function (err, result) {
          if (!err) {
            result = _.map(_.without(result, null), function (item) {
              return JSON.parse(item);
            });
            this.ws.emit('update', result);

            var cmds = _.map(keys, function (key) {
              return [ 'del', key ];
            });
            redis.multi(cmds).exec();
          } else {
            this.ws.emit('error', err);
          }
        }.bind(this));
      } else if (err) {
        this.ws.emit('error', err);
      }
    }.bind(this));
  },

  stop: function () {
    redis.del('client:' + this.sid);

    redis.keys('queue:' + this.sid + ':*', function (err, keys) {
      if (!err) {
        var cmds = _.map(keys, function (key) {
          return [ 'del', key ];
        });
        redis.multi(cmds).exec();
      } else {
        this.ws.emit('error', err);
      }
    });

    if (!this.interval) return;

    clearInterval(this.interval);
    this.interval = null;
  }
}

module.exports = Scheduler;
