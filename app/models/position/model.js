'use strict';

var _ = require('underscore');
_.str = require('underscore.string');
_.diff = require('../../lib/helper/diff');

var Backbone = require('backbone');
var moment = require('moment');
var GeographicLib = require('geographiclib');

var Map = require('../../map/map');

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

  getMarker: function () {
    if (!this.positionMarker) {
      this.positionMarker =  new PositionMarker(this);
    }
    return this.positionMarker;
  },

  getLabel: function () {
    if (!this.positionLabel) {
      this.positionLabel = new PositionLabel(this);
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
    return Map.getLngLat(this)
  },

  distanceTo: function (LngLat) {
    var coords = this.getLngLat();
    var geod = GeographicLib.Geodesic.WGS84;
    return Math.round(geod.Inverse(LngLat.lat, LngLat.lng, coords.lat, coords.lng).s12);
  },

  diff: function (data) {
    if (data instanceof Backbone.RelationalModel) {
      data = data.toJSON();
    }

    var A = _.clone(this.attributes);
    delete A.id;
    delete A.timestamp;
    delete A.datetime;
    delete A.raw;
    delete A.selected;
    delete A.mouseover;

    var B = _.clone(data);
    if (B) {
      delete B.id;
      delete B.timestamp;
      delete B.datetime;
      delete B.raw;
    }

    var diff = _.diff(A, B);

    return !_.isEmpty(diff) ? diff : false;
  }
});

module.exports = Position;
