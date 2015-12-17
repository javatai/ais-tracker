'use strict';

var _ = require('underscore');
var bganimate = require('../lib/helper/background-animate');

var View = require('../lib/view');
var template = require('./ship-details.hbs');

var ShipDetails = View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-condensed details fixedhead',
  shipdata: null,

  initialize: function () {
    this.shipdata = this.model.get('shipdata');
  },

  render: function (model) {
    var diff = this.shipdata.changed;

    this.$el.html(this.template({
      properties: this.shipdata && this.shipdata.getHelper().toPropertyList()
    }));

    _.each(diff, function (changed, field) {
      bganimate(this.$el.find('.' + field));
    }, this);
  }
});

module.exports = ShipDetails;
