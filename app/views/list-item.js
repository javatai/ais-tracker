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
    this.updateIndex();

    this.listview = options.listview;

    this.listenTo(this.collection, 'sort', function () {
      this.updateIndex();
      this.insert();
    }, this);
  },

  updateIndex: function () {
    this.index = this.collection.indexOf(this.model);
  },

  insert: function () {
    var before = null, after = null;
    _.each(this.listview.listItems, function (item) {
      if (item.index < this.index && (!before || before.index < item.index)) {
        before = item;
      }
      if (item.index > this.index && (!after || after.index > item.index)) {
        after = item;
      }
    }, this);

    if (before) {
      this.$el.insertAfter(before.$el);
    } else if (after) {
      this.$el.insertBefore(after.$el);
    } else {
      this.listview.getContainer().append(this.$el);
    }
  },

  show: function () {
    this.$el.show();
  },

  hide: function () {
    this.$el.hide();
  },

  update: function () {
    var s = this.listview.selectedColumn;

    this.$el.html(this.template({
      index: (this.index + 1),
      name: this.model.getHelper().toTitel(),
      value: s.format && s.format(this.model.get(s.getter)) || this.model.get(s.getter)
    }));

    if (this.model.affectedByFilter(this.listview.search)) {
      this.hide();
    }
  },

  updateFlash: function () {
    this.update();

    if (this.collection.currentSort.strategy === 'datetime') {
      this.collection.sort();
    } else {
      this.insert();
    }

    if (!this.model.affectedByFilter(this.listview.search)) {
      bganimate(this.$el);
    }
  },

  render: function () {
    this.update();
    this.insert();
    this.listenTo(this.model, 'change:datetime', this.updateFlash);
  }
});

module.exports = ListItem;
