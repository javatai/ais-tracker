'use strict';

var Backbone = require('backbone');
var bganimate = require('../lib/background-animate');

var template = require('./log-view.hbs');
var LogItemView = require('./log-item');

var log = require('../models/log/collection');

var LogView = Backbone.View.extend({
  tagName: 'div',
  className: 'item logview',
  template: template,

  events: {
    'click form': 'filter',
    'click tbody tr': 'select'
  },

  select: function (el) {
    var cls = $(el.currentTarget).attr('class');
    location.hash = 'mmsi/' + (cls.split(' ')).shift();
  },

  filter: function () {
    if (this.$el.find('input').is(':checked')) {
      this.$el.addClass('positions');
      this.positionsOnly = true;
    } else {
      this.$el.removeClass('positions');
      this.positionsOnly = false;
    }
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
    this.listenTo(this.collection, 'remove', this.removeItemView);
  }
});

module.exports = LogView;
