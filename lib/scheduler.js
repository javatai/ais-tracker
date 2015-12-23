var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var _ = require('underscore');

var Redis = require('redis');

var Scheduler = function (ws) {
  this.lvq = {};
  this.sid = ws.id;
  this.ws = ws;

  this.client = Redis.createClient(config.redis);

  this.client.keys('data:*:ship', function (err, keys) {
    if (!err && !_.isEmpty(keys)) {
      this.client.mget(keys, function (err, result) {
        if (!err) {
          result = _.map(_.without(result, null), function (item) {
            return JSON.parse(item);
          });
          this.init('init', result);
        } else {
          this.init('error', err);
        }
      }.bind(this));
    } else if (_.isEmpty(keys)) {
      this.init('init', []);
    } else {
      this.init('error', err);
    }
  }.bind(this));
};

Scheduler.prototype = {
  init: function (type, payload) {
    this.ws.emit('init', payload);
    this.interval = setInterval(this.process.bind(this), 1000);

    this.subscriber = Redis.createClient(config.redis);
    this.subscriber.on('message', this.onMessage.bind(this));
    this.subscriber.subscribe('queue');

    this.listener = Redis.createClient(config.redis);
    this.listener.on("pmessage", this.onExpire.bind(this));
    this.listener.psubscribe("__keyevent@0__:expired");
  },

  onExpire: function (pattern, channel, expiredKey) {
    var match = expiredKey.match(/data:(.*):ship/i);
    if (_.isNull(match)) {
      return;
    }

    if (!this.lvq[mmsi]) {
      this.lvq[mmsi] = { };
    }

    this.lvq[mmsi]['ship'] = { model: 'ship', method: 'expire', data: { userid: mmsi } };
  },

  onMessage: function (channel, message) {
    var json = JSON.parse(message);
    var mmsi = json.data.userid;

    if (!this.lvq[mmsi]) {
      this.lvq[mmsi] = { };
    }

    if (json.method === 'update') {
      this.lvq[mmsi][json.model] = json;
    } else if (json.method === 'expire') {
      this.lvq[mmsi][json.model] = json;
    }
  },

  process: function () {
    var payload = _.map(this.lvq, function (data) {
      return _.first(_.values(data));
    });

    if (!_.isEmpty(payload)) {
      this.ws.emit('update', payload);
    }

    this.lvq = {};
  },

  stop: function () {
    this.subscriber.unsubscribe('queue');
    this.listener.punsubscribe('__keyevent@0__:expired');

    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = null;
  },

  track: function (mmsi) {
    this.client.mget('data:' + mmsi + ':track', function (err, result) {
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
  }
}

module.exports = Scheduler;
