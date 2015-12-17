'use strict';

var _ = require('underscore');
var bganimate = require('../lib/helper/background-animate');

var View = require('../lib/view');
var template = require('./ship-position.hbs');

var ShipPosition = View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-condensed position fixedhead',
  position: null,

  initialize: function () {
    this.position = this.model.get('position');
  },

  render: function () {
    var diff = this.position.changed;

    this.$el.html(this.template({
      properties: this.position && this.position.getHelper().toPropertyList()
    }));

    _.each(diff, function (changed, field) {
      bganimate(this.$el.find('.' + field));
    }, this);
  }
});

module.exports = ShipPosition;
