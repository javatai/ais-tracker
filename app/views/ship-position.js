'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var bganimate = require('../lib/helper/background-animate');

var template = require('./ship-position.hbs');

var ShipPosition = Backbone.View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-condensed position fixedhead',
  position: null,

  initialize: function () {
    this.position = this.model.get('position');
  },

  render: function (model) {
    var diff = {};
    if (model && this.position) {
      diff = model.get('position').diff(this.position);
      this.model = model;
      this.position = model.get('position');
    }

    this.$el.html(this.template({
      properties: this.position && this.position.getHelper().toPropertyList()
    }));

    _.each(diff, function (changed, field) {
      bganimate(this.$el.find('.' + field));
    }, this);
  }
});

module.exports = ShipPosition;
