'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var GeographicLib = require('geographiclib');

var Positions = require('../position/collection');
var Position = require('../position/model');

var ShipData = require('../shipdata/collection');
var Shipdatum = require('../shipdata/model');

var Track = require('../track/collection');
var TrackPosition = require('../track/model');

var Ship = Backbone.RelationalModel.extend({
  idAttribute: "userid",
  dimension: undefined,

  relations: [{
    type: Backbone.HasOne,
    key: 'position',
    relatedModel: Position,
    collectionType: Positions
  }, {
    type: Backbone.HasOne,
    key: 'shipdata',
    relatedModel: Shipdatum,
    collectionType: ShipData
  }, {
    type: Backbone.HasMany,
    key: 'track',
    relatedModel: TrackPosition,
    collectionType: Track,
    reverseRelation: {
      key: 'ship'
    }
  }],

  distanceTo: function (LngLat) {
    var coords = this.get('position').getLngLat();

    var geod = GeographicLib.Geodesic.WGS84;
    return geod.Inverse(LngLat.lat, LngLat.lng, coords.lat, coords.lng).s12;
  },

  affectedByFilter: function (filter) {
    if (filter.length < 1) return true;

    var name = this.has('shipdata') && this.get('shipdata').has('name') && this.get('shipdata').get('name').toLowerCase() || '';
    var mmsi = this.get('userid');

    if (name.indexOf(filter) > -1 || String(mmsi).indexOf(filter, 0) === 0) {
      return true;
    }
    return false;
  },

  hasShape: function () {
    if (!_.isEmpty(this.dimension)) {
      return this.dimension;
    }

    if (this.has('shipdata')) {
      var data = this.get('shipdata');
      var a = data.get('dima') || 0;
      var b = data.get('dimb') || 0;
      var c = data.get('dimc') || 0;
      var d = data.get('dimd') || 0;

      if ((a || b) && (c || d)) {
        this.dimension = { a: a, b: b, c: c, d: d };
        return this.dimension;
      }
    }
  },

  toTitle: function () {
    return this.has('shipdata') && this.get('shipdata').get('name') || this.get('userid');
  }
});

module.exports = Ship;
