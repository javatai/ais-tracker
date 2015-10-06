'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var ShipMarker = Backbone.Model.extend({
  source: null,
  layer: null,

  initialize: function (model, options) {
    this.mapgl = options.map;
    this.on('change:selected', this.addToMap, this);
    this.get('ship').on('change', this.process, this);
    this.process();
  },

  process: function () {
    if (this.get('ship').has('position')) {
      this.addToMap();
    }
  },

  toFeature: function () {
    var ship = this.get('ship');
    var position = ship.get('position');

    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": position.getCoordinate()
      },
      "properties": {
        "title": this.get('ship').getHelper().toTitel(),
        "marker-symbol": this.get('selected') && "triangle" || "triangle-stroked",
        "id": this.get('id')
      }
    }
  },

  addSource: function (data) {
    if (!this.source) {
      this.source = this.mapgl.addSource(this.get('id'), {
        "type": "geojson",
      });
    }
    this.mapgl.getSource(this.get('id')).setData(data);
  },

  addLayer: function () {
    var ship = this.get('ship');
    var position = ship.get('position');

    if (this.layer) {
      this.mapgl.removeLayer(this.get('id'));
    }

    this.layer = this.mapgl.addLayer({
      "id": this.get('id'),
      "type": "symbol",
      "source": this.get('id'),
      "interactive": true,
      "layout": {
        "icon-image": "{marker-symbol}-11",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "icon-rotate": position.has('cog') && position.get('cog') || 0,
        "visibility": "visible"
      }
    });
  },

  addToMap: function () {
    this.addSource(this.toFeature());
    this.addLayer();
  },

  removeFromMap: function () {
    this.off('change:selected', this.addToMap, this);

    if (this.mapgl.getSource(this.get('id'))) {
      this.mapgl.removeSource(this.get('id'));
      this.mapgl.removeLayer(this.get('id'));
    }

    delete this.source;
    delete this.layer;
  }
});

module.exports = ShipMarker;
