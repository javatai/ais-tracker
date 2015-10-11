var Backbone = require('backbone');
var ShipTrackItemView = require('./ship-track-item');
var template = require('./ship-track.hbs');

var ShipTrack = Backbone.View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-hover table-condensed track fixedhead',

  initialize: function () {
    this.index = 1;
    this.items = { };
  },

  render: function () {
    this.$el.html(this.template());

    this.collection.each(function (position, index) {
      if (index < this.collection.length - 1) {
        var shipTrackItem = new ShipTrackItemView({
          index: this.index++,
          model: position
        });

        shipTrackItem.render();
        this.items[position.get('id')] = shipTrackItem;
        this.$el.prepend(shipTrackItem.$el);
      }
    }, this);

    var shipTrackItem = new ShipTrackItemView({
      index: this.index,
      model: this.model
    });
    shipTrackItem.render();
    this.items[this.model.get('id')] = shipTrackItem;
    this.$el.prepend(shipTrackItem.$el);
  }
});

module.exports = ShipTrack;
