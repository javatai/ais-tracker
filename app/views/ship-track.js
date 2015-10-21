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
    this.lastPosition = null;
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

  checkShipPosition: function () {
    if (this.model.get('track').length < 1) return;

    var lastTrackCoordinate = this.model.get('track').last().getCoordinate();
    var lastCoordinate = this.model.get('position').getCoordinate();
    var diff = _.diff(lastCoordinate, lastTrackCoordinate);

    if (!_.isEmpty(diff)) {
      this.lastPosition = this.model.get('position');
      this.addPosition(this.lastPosition);
    } else {
      this.lastPosition = null;
    }
  },

  updateView: function () {
    _.invoke(this.items, 'remove');
    this.items = {};

    this.$el.find('> table > tbody').empty();

    this.model.get('track').each(this.addPosition, this);

    this.checkShipPosition();

    this.updateSlider();
  },

  addPosition: function (position) {
    var shipTrackItem = new ShipTrackItemView({
      model: position
    });
    this.items[position.get('id')] = shipTrackItem;

    shipTrackItem.render();
    this.$el.find('> table > tbody').prepend(shipTrackItem.$el);

    this.updateSlider();
  },

  addNewPosition: function (position) {
    if (this.lastPosition) {
      this.removePosition(this.lastPosition);
    }
    this.addPosition(position);
    this.checkShipPosition();
  },

  changeLastPosition: function () {
    if (this.lastPosition) {
      this.removePosition(this.lastPosition);
    }
    this.checkShipPosition();
  },

  removePosition: function (remove) {
    if (remove && this.items[remove.get('id')]) {
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
  },

  remove: function () {
    _.invoke(this.items, 'remove');

    Backbone.View.prototype.remove.call(this);
  }
});

module.exports = ShipTrack;
