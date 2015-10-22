'use strict';

var View = require('../lib/view');
var template = require('./ship-track-item.hbs');

var ShipTrackItem = View.extend({
  template: template,
  tagName: 'tr',

  initialize: function (options) {
    this.options = options;
  },

  render: function () {
    this.$el.html(this.template({
      latitude: this.model.getHelper().format('Latitude').value,
      longitude: this.model.getHelper().format('Longitude').value,
      nav: this.model.getHelper().getNav(),
      timestamp: this.model.getHelper().format('Timestamp').value
    }));
  }
});

module.exports = ShipTrackItem;
