'use strict';

var config = require('../../config').frontend.mapboxgljs;
var Platform = require('../../lib/platform');

var mapboxgl = require('mapbox-gl');
mapboxgl.accessToken = config.accessToken;

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var GeographicLib = require('geographiclib');

var Map = function (options) {
  this.map = new mapboxgl.Map({
    container: 'map',
    style: require('./style.json'),
    center: config.center,
    zoom: config.zoom
  });

  this.perimeter = -1;

  this.map.on('zoom', _.bind(this.onZoom, this));
  this.map.on('mousemove', _.bind(this.propagateMousemove, this));
  this.map.on('click', _.bind(this.propagateClick, this));

  this.map.on('moveend', _.bind(this.propagateBoundsChanged, this));
};

_.extend(Map.prototype, Backbone.Events, {
  resetCursor: function () {
    this.map.getCanvas().style.cursor = "";
  },

  setCursor: function (style) {
    this.map.getCanvas().style.cursor = style;
  },

  propagateMousemove: function (e) {
    this.trigger('mousemove', e);
  },

  propagateClick: function (e) {
    this.trigger('click', e);
  },

  propagateBoundsChanged: function () {
    this.trigger('boundschanged', this.getBounds());
  },

  onReady: function () {
    var dfd = $.Deferred();

    if (this.map._loaded) {
      dfd.resolve();
    }

    this.map.on('load', dfd.resolve);

    return dfd.promise();
  },

  getMap: function () {
    return this.map;
  },

  zoomIn: function () {
    this.map.zoomIn();
  },

  zoomOut: function () {
    this.map.zoomOut();
  },

  toHome: function () {
    this.map.flyTo({
      center: config.center,
      zoom: config.zoom
    });
  },

  toNorth: function () {
    this.map.resetNorth();
  },

  onZoom: function () {
    this.perimeter = -1;
  },

  inView: function (lnglat) {
    var bounds = this.map.getBounds();

    if (this.map.getZoom() >= 14
      && (bounds.getNorth() > lnglat.lat
        || bounds.getEast() > lnglat.lng
        || bounds.getSouth() < lnglat.lat
        || bounds.getWest() < lnglat.lng)) {
      return true;
    }

    return false;
  },

  calculatePerimeter: function () {
    if (this.perimeter > 0) {
      return this.perimeter;
    }

    var bounds = this.map.getBounds();
    var nw = bounds.getNorthWest();
    var ne = bounds.getNorthEast();

    var geod = GeographicLib.Geodesic.WGS84;

    var dist = Math.round(geod.Inverse(nw.lat, nw.lng, ne.lat, ne.lng).s12);
    var width = $('body').width();

    this.perimeter = 10 * (dist/width);

    return this.perimeter;
  },

  addToMap: function (conf) {
    if (!this.map.getSource(conf.name)) {
      this.map.addSource(conf.name, {
        "type": "geojson",
        "data": conf.data
      });
    } else {
      this.map.getSource(conf.name).setData(conf.data);
    }

    _.each(conf.layer, function (layer) {
      if (this.map.style._layers[layer.name] && layer.force === true) {
        this.map.removeLayer(layer.name);
      } else if (!this.map.style._layers[layer.name]) {
        var json = layer.json;
        json.id = layer.name;
        json.source = conf.name;

        if (layer.behind) {
          this.map.addLayer(json, layer.behind);
        } else {
          this.map.addLayer(json);
        }
      }
    }, this);
  },

  removeFromMap: function (conf) {
    _.each(conf.layer, function (layer) {
      if (this.map.style._layers[layer]) {
        this.map.removeLayer(layer);
      }
    }, this);

    if (this.map.getSource(conf.name)) {
      this.map.removeSource(conf.name);
    }
  },

  setPaintProperty: function (id, name, value) {
    var self = this;
    this.onReady().done(function () {
      self.map.setPaintProperty(id, name, value);
    });
  },

  calculateOffsetBounds: function (lnglat) {
    var geod = GeographicLib.Geodesic.WGS84;

    var padding = 500;

    var N = geod.Direct(lnglat.lat, lnglat.lng, 0, padding);
    var E = geod.Direct(lnglat.lat, lnglat.lng, 90, padding);
    var S = geod.Direct(lnglat.lat, lnglat.lng, 180, padding);
    var W = geod.Direct(lnglat.lat, lnglat.lng, 270, padding);

    var wpx = $('body').width();
    var wm = geod.Inverse(N.lat2, E.lon2, S.lat2, W.lon2).s12;

    var m = 420 * wm / wpx;
    var P = geod.Direct(S.lat2, W.lon2, 270, m);

    var SW = new mapboxgl.LngLat(P.lon2, P.lat2);
    var NE = new mapboxgl.LngLat(E.lon2, N.lat2);

    return new mapboxgl.LngLatBounds(SW, NE);
  },

  center: function (lnglat) {
    if (!Platform.isMobile) {
      var bounds = this.calculateOffsetBounds(lnglat);
      this.map.fitBounds(bounds);
    } else {
      this.map.flyTo({ center: lnglat, zoom: 15 });
    }
  },

  getLngLat: function (position) {
    return new mapboxgl.LngLat(position.get('longitude'), position.get('latitude'));
  },

  moveIntoView: function (position) {
    var lnglat = position.getLngLat();
    var center = position.getCoordinate();

    var bounds = this.map.getBounds();

    if (bounds.getNorth() < lnglat.lat) {
      // console.log('N', bounds.getNorth(), lnglat.lat, bounds.getNorth() < lnglat.lat);
      this.map.flyTo({ center: center });
    }

    if (bounds.getEast() < lnglat.lng) {
      // console.log('E', bounds.getEast(), lnglat.lng, bounds.getEast() < lnglat.lng);
      this.map.flyTo({ center: center });
    }

    if (bounds.getSouth() > lnglat.lat) {
      // console.log('S', bounds.getSouth(), lnglat.lat, bounds.getSouth() > lnglat.lat);
      this.map.flyTo({ center: center });
    }

    if (bounds.getWest() > lnglat.lng) {
      // console.log('W', bounds.getWest(), lnglat.lng, bounds.getWest() > lnglat.lng);
      this.map.flyTo({ center: center });
    }
  },

  getBounds: function () {
    var bounds = this.map.getBounds();

    if (!bounds) return;

    return {
      north: bounds.getNorth(),
      east: bounds.getEast(),
      south: bounds.getSouth(),
      west: bounds.getWest()
    }
  }
});

module.exports = Map;
