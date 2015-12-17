'use strict';

var $ = require('jquery');
var bganimate = require('../lib/helper/background-animate');

var LogItemView = require('./log-item');
var log = require('../models/log/collection');

var Ship = require('../models/ship/model');

var View = require('../lib/view');
var template = require('./log-view.hbs');

var LogView = View.extend({
  tagName: 'div',
  className: 'item logview',
  template: template,

  events: {
    'click tbody tr': 'select'
  },

  select: function (el) {
    var cls = $(el.currentTarget).attr('class');
    var mmsi = (cls.split(' ')).shift();

    var ship = Ship.findOrCreate({ userid: mmsi });
    ship.collection.selectShip(ship);
  },

  initialize: function () {
    this.collection = log;
    this.isShown = false;
    this.positionsOnly = false;
    this.render();
  },

  getContainer: function () {
    return this.container;
  },

  addItemView: function (model) {
    var logItem = new LogItemView({
      model: model
    });

    logItem.render();
    this.container.prepend(logItem.$el);

    if (this.isShown && ( !this.positionsOnly || model.get('type') === 'position-added' )) {
      bganimate(logItem.$el);
    }
  },

  render: function () {
    this.$el.html(this.template({ }));
    this.container = this.$el.find('tbody');

    this.listenTo(this.collection, 'add', this.addItemView);
  }
});

module.exports = LogView;
