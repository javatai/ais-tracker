var _ = require('underscore');
var Backbone = require('backbone');

var template = require('./ship-view.hbs');

var ShipView = Backbone.View.extend({
  template: template,

  initialize: function () {
    this.isShown = false;
    this.listenTo(this.model.get('track'), "sync", this.render);
  },

  render: function () {
    var track = this.model.get('track').getHelper().toPropertyList();

    this.$el.html(this.template({
      title: this.model.getHelper().toTitel(),
      ship: this.model.has('shipdata') && this.model.get('shipdata').getHelper().toPropertyList(),
      position: this.model.get('position').getHelper().toPropertyList(),
      track: !_.isEmpty(track) ? track : false,
      positiontab: this.model.has('shipdata') ? false : true
    }));
  }
});

module.exports = ShipView;
