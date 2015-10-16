'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var noUiSlider = require('nouislider');

var ShipTrackItemView = require('./ship-track-item');
var template = require('./ship-track.hbs');

var ShipTrack = Backbone.View.extend({
  template: template,
  tagName: 'div',

  initialize: function () {
    this.start = 1;
    this.lastPositionId = 0;
  },

  updateSlider: function () {
    var slider = _.first(this.$el.find('.range'));
    if (slider.noUiSlider) {
      slider.noUiSlider.destroy();
    }

    noUiSlider.create(slider, {
      start: this.start,
      connect: "upper",
      step: 1,
      range: {
        'min': [ 1 ],
        'max': [ this.model.get('track').length ]
      },
      pips: {
        mode: 'range',
        density: 5
      }
    });

    slider.noUiSlider.on('change', _.bind(function (value) {
      value = Number(value);
      this.start = value;
      this.model.get('track').setRange(value - 1);
    }, this));
  },

  updateView: function () {
    _.invoke(this.items, 'remove');
    this.items = {};

    this.$el.find('> table > tbody').empty();

    this.model.get('track').each(this.addPosition, this);

    this.lastPosition = this.model.get('position');
    this.addPosition(this.lastPosition);

    this.updateSlider();
  },

  addPosition: function (position) {
    var shipTrackItem = new ShipTrackItemView({
      index: _.size(this.items)+1,
      model: position
    });

    shipTrackItem.render();
    this.items[position.get('id')] = shipTrackItem;

    this.$el.find('> table > tbody').prepend(shipTrackItem.$el);

    this.updateSlider();
  },

  addNewPosition: function (position) {
    this.removePosition(this.lastPosition.get('id'));
    this.addPosition(position);

    this.lastPosition = this.model.get('position');
    this.addPosition(this.lastPosition);
  },

  changeLastPosition: function () {
    this.removePosition(this.lastPosition);
    this.lastPosition = this.model.get('position');
    this.addPosition(this.lastPosition);
  },

  removePosition: function (remove) {
    if (this.items[remove.get('id')]) {
      this.items[remove.get('id')].remove();
      delete this.items[remove.get('id')];
    }

    this.updateSlider();
  },

  render: function () {
    this.$el.html(this.template());

    this.listenToOnce(this.model.get('track'), "sync", function () {
      this.updateView();
      this.listenTo(this.model.get('track'), "add", this.addNewPosition);
      this.listenTo(this.model, "change:position", this.changeLastPosition);
      this.listenTo(this.model.get('track'), "remove", this.removePosition);
    }, this);
  }
});

module.exports = ShipTrack;
