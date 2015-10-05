'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../../lib/MapUtil');

var Positions = require('../position/collection');
var Position = require('../position/model');

var ShipData = require('../shipdata/collection');
var ShipDatum = require('../shipdata/model');

var Track = require('../track/collection');

var Ship = Backbone.RelationalModel.extend({
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

  fetchTrack: function () {
    var collection = this.get('track');
    collection.setId(this.get('id'));
    return collection.fetch();
  },

  toTitel: function () {
    return this.has('shipdata') && this.get('shipdata').get('name') || this.get('userid');
  },

  distanceTo: function (LngLat) {
    var coords = this.get('position').getLngLat();
    return MapUtil.distance(LngLat.lat, LngLat.lng, coords.lat, coords.lng);
  }
});

module.exports = Ship;
