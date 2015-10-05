'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Popup = require('./popup');

var Label = function (map) {
  this.mapgl = map;
};

_.extend(Label.prototype, Backbone.Events, {
  label: null,

  showLabel: function () {
    this.label = new Popup()
      .setLngLat(this.getCoordinates())
      .setHTML(this.toTitel())
      .addClass(this.classname)
      .addTo(this.mapgl);

    this.label.once('remove', _.bind(function (label) {
      delete this.label;
    }, this));
  },

  hideLabel: function () {
    if (this.label) {
      this.label.remove();
      delete this.label;
    }
  }
});

Label.extend = Backbone.Model.extend;

module.exports = Label;