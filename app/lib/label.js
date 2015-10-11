'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Popup = require('./popup');

var Label = function () {
  this.listenTo(this.model, 'change', this.process);
};

_.extend(Label.prototype, Backbone.Events, {
  label: null,

  process: function () {
    if (this.model.get('mouseover') === true) {
      this.showLabel();
    } else {
      this.hideLabel();
    }
  },

  showLabel: function () {
    if (this.label) {
      this.hideLabel();
    }

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

module.exports = Label;
