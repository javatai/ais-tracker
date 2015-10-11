var Backbone = require('backbone');

var template = require('./ship-details.hbs');

var ShipPosition = Backbone.View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-condensed position fixedhead',

  render: function () {
    this.$el.html(this.template({
      properties: this.model && this.model.getHelper().toPropertyList()
    }));
  }
});

module.exports = ShipPosition;
