var _ = require('underscore');
var Backbone = require('backbone');
var bganimate = require('../lib/background-animate');

var template = require('./ship-details.hbs');

var ShipDetails = Backbone.View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-condensed details fixedhead',

  render: function (model) {
    var shipdata = this.model.get('shipdata');

    var diff = [];
    if (model && model.has('shipdata')) {
      diff = shipdata.diff(model.get('shipdata'));
      this.model = model;
      shipdata = model.get('shipdata');
    }

    this.$el.html(this.template({
      properties: shipdata && shipdata.getHelper().toPropertyList()
    }));

    _.each(diff, function (changed, field) {
      bganimate(this.$el.find('.' + field));
    }, this);
  }
});

module.exports = ShipDetails;
