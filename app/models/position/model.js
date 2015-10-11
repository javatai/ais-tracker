'use strict';

var _ = require('underscore');
_.str = require("underscore.string");
var Backbone = require('backbone');
var moment = require('moment');
var MapUtil = require('../../lib/map-util');
var mapboxgl = require('mapbox-gl');

var PositionHelper = require('./helper');
var PositionMarker = require('./marker');
var PositionLabel = require('./label');

var Position = Backbone.RelationalModel.extend({
  positionHelper: null,
  positionLabel: null,
  positionMarker: null,

  defaults: {
    'mouseover': false,
    'selected': false
  },

  getHelper: function () {
    if (!this.positionHelper) {
      this.positionHelper =  new PositionHelper(this);
    }
    return this.positionHelper;
  },

  getMarker: function (mapgl) {
    if (!this.positionMarker) {
      this.positionMarker =  new PositionMarker(this, mapgl);
    }
    return this.positionMarker;
  },

  getLabel: function (mapgl) {
    if (!this.positionLabel) {
      this.positionLabel = new PositionLabel(this, mapgl);
    }
    return this.positionLabel;
  },

  parse: function (data, xhr) {
    data.raw = data.raw && JSON.parse(data.raw) || data.raw;
    return Backbone.RelationalModel.prototype.parse.call(this, data, xhr);
  },

  getCoordinate: function () {
    return [
      this.get('longitude'),
      this.get('latitude')
    ]
  },

  getLngLat: function () {
    return new mapboxgl.LngLat(this.get('longitude'), this.get('latitude'));
  },

  distanceTo: function (LngLat) {
    var coords = this.getLngLat();
    return MapUtil.distance(LngLat.lat, LngLat.lng, coords.lat, coords.lng);
  }
});

module.exports = Position;
