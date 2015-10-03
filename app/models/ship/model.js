var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../../lib/MapUtil');

var Positions = require('../position/collection');
var Position = require('../position/model');

var ShipData = require('../shipdata/collection');
var ShipDatum = require('../shipdata/model');

var Track = require('../track/collection');

var Popup = require('../../map/popup');

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

  selected: false,
  toFeature: function () {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": this.get('position').getCoordinate()
      },
      "properties": {
        "title": this.get('id') + ': ' + (this.has('shipdata') && this.get('shipdata').get('name') || this.get('userid')),
        "marker-symbol": this.isSelected && "triangle" || "triangle-stroked",
        "id": this.get('id'),
        "mapid": "marker-" + this.get('userid')
      }
    }
  },

  toTitle: function () {
    var title = this.has('shipdata') && this.get('shipdata').get('name') || this.get('userid');
    title += '<hr>';
    title += this.get('position').toTitle();

    return title;
  },

  label: null,
  showLabel: function (map) {
    if (this.label) {
      return;
    }
    this.label = new Popup()
      .setLngLat(this.get('position').getCoordinate())
      .setHTML(this.toTitle())
      .addClass('ship-label')
      .addTo(map);

    this.label.once('remove', _.bind(function (label) {
      delete this.label;
    }, this))
  },

  hideLabel: function () {
    if (!this.label) {
      return;
    }
    try {
      this.label.remove();
      delete this.label;
    } catch (ex) { }
  },

  distanceTo: function (LngLat) {
    var coords = this.get('position').getLngLat();
    return MapUtil.distance(LngLat.lat, LngLat.lng, coords.lat, coords.lng);
  },

  selected: function (map, isSelected) {
    this.isSelected = isSelected;
    this.addTo(map);
  },

  source: null,
  layer: null,

  addTo: function (map, options) {
    options = options || {};

    if (this.layer) {
      map.getSource("ship-" + this.get('userid')).setData(this.toFeature());
      return;
    }

    this.source = map.addSource("ship-" + this.get('userid'), {
      "type": "geojson",
      "data": this.toFeature()
    });

    this.layer = map.addLayer(_.extend({
      "id": "ship-" + this.get('userid'),
      "type": "symbol",
      "source": "ship-" + this.get('userid'),
      "interactive": true,
      "layout": {
        "icon-image": "{marker-symbol}-11",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "icon-rotate": this.get('position').has('cog') && this.get('position').get('cog') || 0
      }
    }, options));
  },

  removeFrom: function (map) {
    map.removeSource("ship-" + this.get('userid'));
    map.removeLayer("ship-" + this.get('userid'));
  }
});

module.exports = Ship;
