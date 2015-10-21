'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var bganimate = require('../lib/helper/background-animate');

var template = require('./ship-position.hbs');

var ShipPosition = Backbone.View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-condensed position fixedhead',

  render: function (model) {
    var position = this.model.get('position');

    var diff = [];
    if (model) {
      diff = position.diff(model.get('position'));
      this.model = model;
      position = model.get('position');
    }

    this.$el.html(this.template({
      properties: position && position.getHelper().toPropertyList()
    }));

    _.each(diff, function (changed, field) {
      bganimate(this.$el.find('.' + field));
    }, this);
  }
});

module.exports = ShipPosition;
