'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var Map = require('./map');
var Popup = require('./popup');

var Label = function () {
  this.listenTo(this.model, 'change:mouseover', this.process);
  this.listenTo(this.model, 'remove', this.hideLabel);
};

_.extend(Label.prototype, Backbone.Events, {
  label: null,

  process: function () {
    Map.onReady().done(_.bind(function () {
      if (this.model.get('mouseover') === true) {
        this.showLabel();
      } else {
        this.hideLabel();
      }
    }, this));
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
      .addTo(Map.getMap());

      $(this.label._container).find('.mapboxgl-popup-content').on('click', _.bind(this.onClick, this));

    this.label.once('remove', _.bind(function (label) {
      delete this.label;
    }, this));
  },

  hideLabel: function () {
    if (this.label) {
      $(this.label._container).find('.mapboxgl-popup-content').off('click', _.bind(this.onClick, this));
      this.label.remove();
      delete this.label;
    }
  }
});

module.exports = Label;
