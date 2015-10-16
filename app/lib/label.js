'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var MapGL = require('../map/map');
var Popup = require('./popup');

var Label = function () {
  this.mapgl = MapGL;
  this.listenTo(this.model, 'change:mouseover', this.process);
  this.listenTo(this.model, 'remove', this.hideLabel);
};

_.extend(Label.prototype, Backbone.Events, {
  label: null,

  process: function () {
    if (!this.mapgl._loaded) return;

    if (this.model.get('mouseover') === true) {
      this.showLabel();
    } else {
      this.hideLabel();
    }
  },

  onClick: function () { },

  showLabel: function () {
    if (this.label) {
      this.hideLabel();
    }

    this.label = new Popup()
      .setLngLat(this.getCoordinates())
      .setHTML(this.toTitle())
      .addClass(this.classname)
      .addTo(this.mapgl);

      $(this.label._container).on('click', _.bind(this.onClick, this));

    this.label.once('remove', _.bind(function (label) {
      delete this.label;
    }, this));
  },

  hideLabel: function () {
    if (this.label) {
      $(this.label._container).off('click', _.bind(this.onClick, this));
      this.label.remove();
      delete this.label;
    }
  }
});

module.exports = Label;
