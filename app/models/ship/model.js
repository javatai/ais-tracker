'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../../lib/map-util');

var Positions = require('../position/collection');
var Position = require('../position/model');

var ShipData = require('../shipdata/collection');
var ShipDatum = require('../shipdata/model');

var Track = require('../track/collection');

var ShipHelper = require('./helper');
var ShipMarker = require('./marker');
var ShipLabel = require('./label');

var Ship = Backbone.RelationalModel.extend({
  shipHelper: null,
  shipLabel: null,
  shipMarker: null,

  defaults: {
    'mouseover': false,
    'selected': false
  },

  url: function () {
    return '/api/ship/' + this.get('id');
  },

  relations: [{
    type: Backbone.HasOne,
    key: 'position',
    relatedModel: Position,
    collectionType: Positions
  }, {
    type: Backbone.HasOne,
    key: 'shipdata',
    relatedModel: ShipDatum,
    collectionType: ShipData
  }, {
    type: Backbone.HasMany,
    key: 'track',
    relatedModel: Position,
    collectionType: Track
  }],

  getHelper: function () {
    if (!this.shipHelper) {
      this.shipHelper =  new ShipHelper(this);
    }
    return this.shipHelper;
  },

  getMarker: function (mapgl) {
    if (!this.shipMarker) {
      this.shipMarker =  new ShipMarker(this, mapgl);
    }
    return this.shipMarker;
  },

  getLabel: function (mapgl) {
    if (!this.shipLabel) {
      this.shipLabel = new ShipLabel(this, mapgl);
    }
    return this.shipLabel;
  },

  fetchTrack: function () {
    var collection = this.get('track');
    collection.reset();
    return collection.fetch(this.get('id'));
  },

  distanceTo: function (LngLat) {
    var coords = this.get('position').getLngLat();
    return MapUtil.distance(LngLat.lat, LngLat.lng, coords.lat, coords.lng);
  },

  toTitel: function () {
    return this.getHelper().toTitel();
  },

  beforeRemove: function () {
    this.trigger('onBeforeRemove', this);

    if (this.shipHelper) {
      delete this.shipHelper;
    }
    if (this.shipMarker) {
      this.shipMarker.removeFromMap();
      delete this.shipMarker;
    }
    if (this.shipMarker) {
      this.shipMarker.removeFromMap();
      delete this.shipMarker;
    }
  }
});

module.exports = Ship;
