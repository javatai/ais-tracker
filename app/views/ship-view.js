var _ = require('underscore');
var Backbone = require('backbone');

var template = require('./ship-view.hbs');

var ShipView = Backbone.View.extend({
  template: template,
  isShown: false,

  initialize: function () {
    this.listenTo(this.model.get('track'), "sync", this.render);
  },

  render: function () {
    this.$el.html(this.template({
      title: this.model.getHelper().toTitel(),
      ship: this.model.has('shipdata') && this.model.get('shipdata').getHelper().toPropertyList(),
      position: this.model.get('position').getHelper().toPropertyList(),
      track: this.model.get('track').getHelper().toPropertyList(),
      positiontab: this.model.has('shipdata') ? false : true
    }));
  }
});

module.exports = ShipView;
