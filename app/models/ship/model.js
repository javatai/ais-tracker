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

var Ship = Backbone.RelationalModel.extend({
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
    return new ShipHelper(this);
  },

  fetchTrack: function () {
    var collection = this.get('track');
    collection.reset();
    return collection.fetch(this.get('id'));
  },

  distanceTo: function (LngLat) {
    var coords = this.get('position').getLngLat();
    return MapUtil.distance(LngLat.lat, LngLat.lng, coords.lat, coords.lng);
  }
});

module.exports = Ship;
