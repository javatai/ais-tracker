'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var moment = require('moment');

var Log = function (ships) {
  this.ships = ships;
  this.listenTo(this.ships, 'all', this.log);

  var level = 1;

  this.types = {
    'socket:init': function (collection) {
      if (level >= 2) console.log('init', collection.length);
    },
    'socket:sync': function (collection) {
      if (level >= 2) console.log('sync', collection.length);
    },
    'socket:update': function (model, collection) {
      if (level >= 1) console.log('update', model.toTitle() + ' (' + model.id + ')', model.get('position').get('distancemoved'));
    },
    'socket:add': function (model, collection) {
      if (level >= 1) console.log('add', model.toTitle() + ' (' + model.id + ')', model.get('position').get('distancemoved'));
    },
    'socket:expire': function (model, collection) {
      if (level >= 1) console.log('expire', model.toTitle() + ' (' + model.id + ')');
    },
    'remove': function (model, collection) {
      if (level >= 2) console.log('remove', model.toTitle(), model.get('datetime'));
    },
    'reset': function (collection) {
      if (level >= 2) console.log('reset', collection.length);
    },
    'change': function (collection) {
      if (level >= 5) console.log(arguments);
    }
  };
};

_.extend(Log.prototype, Backbone.Events, {
  log: function (type) {
    if (_.keys(this.types).indexOf(type) < 0) {
      return;
    }

    var args = Array.prototype.slice.call(arguments);
    args.shift();
    this.types[type].apply(this, args);
  }
})

module.exports = Log;
