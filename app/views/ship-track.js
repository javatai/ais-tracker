var Backbone = require('backbone');
var ShipTrackItemView = require('./ship-track-item');
var template = require('./ship-track.hbs');

var ShipTrack = Backbone.View.extend({
  template: template,
  tagName: 'table',
  className: 'table table-hover table-condensed track fixedhead',

  render: function () {
    this.$el.html(this.template());

    this.items = { };
    this.index = 1;

    this.model.get('track').each(function (position, index) {
      if (index < this.model.get('track').length - 1) {
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
      model: this.model.get('position')
    });
    shipTrackItem.render();
    this.items[this.model.get('position').get('id')] = shipTrackItem;
    this.$el.prepend(shipTrackItem.$el);
  }
});

module.exports = ShipTrack;
