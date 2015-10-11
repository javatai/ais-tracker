var Backbone = require('backbone');

var template = require('./ship-track-item.hbs');

var ShipTrackItem = Backbone.View.extend({
  template: template,
  tagName: 'tr',

  initialize: function (options) {
    this.options = options;
  },

  render: function () {
    this.$el.html(this.template({
      index: this.options.index,
      latitude: this.model.getHelper().format('Latitude'),
      longitude: this.model.getHelper().format('Longitude'),
      nav: this.model.getHelper().getNav(),
      timestamp: this.model.getHelper().format('Timestamp')
    }));
  }
});

module.exports = ShipTrackItem;
