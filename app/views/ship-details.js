var Backbone = require('backbone');

var template = require('./ship-details.hbs');

var ShipDetails = Backbone.View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-condensed details fixedhead',

  render: function () {
    this.$el.html(this.template({
      properties: this.model.has('shipdata') && this.model.get('shipdata').getHelper().toPropertyList()
    }));
  }
});

module.exports = ShipDetails;
