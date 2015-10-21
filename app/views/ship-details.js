'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var bganimate = require('../lib/helper/background-animate');

var template = require('./ship-details.hbs');

var ShipDetails = Backbone.View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-condensed details fixedhead',
  shipdata: null,

  initialize: function () {
    this.shipdata = this.model.get('shipdata');
  },

  render: function (model) {
    var diff = {};
    if (model && this.shipdata) {
      diff = model.get('shipdata').diff(this.shipdata);
      this.model = model;
      this.shipdata = model.get('shipdata');
    }

    this.$el.html(this.template({
      properties: this.shipdata && this.shipdata.getHelper().toPropertyList()
    }));

    _.each(diff, function (changed, field) {
      bganimate(this.$el.find('.' + field));
    }, this);
  }
});

module.exports = ShipDetails;
