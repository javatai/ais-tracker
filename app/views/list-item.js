'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var bganimate = require('../lib/background-animate');

var template = require('./list-item.hbs');

var ListItem = Backbone.View.extend({
  tagName: 'tr',
  template: template,
  className: 'list-item',

  events: {
    "click *" : "select"
  },

  attributes: function () {
    return {
      id: 'ship-item-' + this.model.get('id'),
    }
  },

  select: function () {
    this.collection.selectShip(this.model);
  },

  initialize: function (options) {
    this.isRendered = false;

    this.listview = options.listview;
    this.container = this.listview.container;

    this.listenTo(this.model, 'change:datetime', this.updateFlash);
  },

  updateFlash: function () {
    if (this.listview.isShown && this.isRendered && this.model.affectedByFilter(this.listview.search)) {
      bganimate(this.$el);
    }
  },

  render: function () {
    var s = this.listview.selectedColumn;
    this.$el.html(this.template({
      name: this.model.getHelper().toTitle(),
      value: s.format && s.format(this.model.get(s.getter)) || this.model.get(s.getter)
    }));

    this.isRendered = true;
  },

  filter: function () {
    if (!this.model.affectedByFilter(this.listview.search)) {
      this.$el.hide();
    } else {
      this.$el.show();
    }
  },

  prepend: function () {
    if (this.model.affectedByFilter(this.listview.search)) {
      this.container.prepend(this.$el);
    }
  },

  after: function ($el) {
    if (this.model.affectedByFilter(this.listview.search)) {
      $el.after(this.$el);
    }
  }
});

module.exports = ListItem;
