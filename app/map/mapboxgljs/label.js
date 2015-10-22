'use strict';

var $ = require('jquery');
var _ = require('underscore');
var View = require('../../lib/view');

var Map = require('./map');
var Popup = require('./popup');

var Label = View.extend({
  onClick: _.noop,

  initialize: function () {
    this.label = null;
    this.listenTo(this.model, 'change:mouseover', this.process);
    this.listenTo(this.model, 'remove', this.hideLabel);
  },

  process: function () {
    Map.onReady().done(_.bind(function () {
      if (this.model.get('mouseover') === true) {
        this.showLabel();
      } else {
        this.hideLabel();
      }
    }, this));
  },

  _click: function (e) {
    this.onClick(e);
    this.hideLabel();
  },

  showLabel: function () {
    if (this.label) {
      this.hideLabel();
    }

    this.label = new Popup()
      .setLngLat(this.getCoordinates())
      .setHTML(this.toTitle())
      .addClass(this.classname)
      .addTo(Map.getMap());

    $(this.label._container).find('.mapboxgl-popup-content').on('click', _.bind(this._click, this));

    this.label.once('remove', _.bind(function (label) {
      delete this.label;
    }, this));
  },

  hideLabel: function () {
    if (this.label) {
      $(this.label._container).find('.mapboxgl-popup-content').off('click', _.bind(this._click, this));
      this.label.remove();
      delete this.label;
    }
  }
});

module.exports = Label;
