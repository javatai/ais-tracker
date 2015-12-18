var config = require('../../config').frontend.mapboxgljs;
var Platform = require('../../platform');

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var GeographicLib = require('geographiclib');

var mapboxgl = require('mapbox-gl');
mapboxgl.accessToken = config.accessToken;

var Map = function (options) {
  this.map = new mapboxgl.Map({
    container: 'map',
    style: require('./style.json'),
    center: config.center,
    zoom: config.zoom
  });

  this.map.on('mousemove', this.onMousemove.bind(this));
  this.map.on('click', this.onClick.bind(this));
}

_.extend(Map.prototype, Backbone.Events, {
  setFilter: function (layer, filter) {
    try {
      this.map.setFilter(layer, filter);
    } catch (ex) { }
  },

  onClick: function (e) {
    this.map.featuresAt(e.point, {
        radius: 5,
        layers: [ 'markers', 'shapes' ]
    }, function (err, features) {
      if (!err && features.length) {
        this.trigger('click', _.first(features).properties.id);
      } else {
        this.trigger('clickout');
      }
    }.bind(this));
  },

  onMousemove: function (e) {
    this.map.featuresAt(e.point, {
        radius: 5,
        layers: [ 'markers', 'shapes', 'track', 'positions' ]
    }, function (err, features) {
      if (!err && features.length) {
        this.trigger('mouseover', _.first(features).properties.id);
        this.map.getCanvas().style.cursor = "pointer";
      } else {
        this.trigger('mouseout');
        this.map.getCanvas().style.cursor = "";
      }
    }.bind(this));
  },

  onReady: function () {
    var dfd = $.Deferred();
    this.map.on('load', dfd.resolve);
    return dfd.promise();
  },

  getMap: function () {
    return this.map;
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
  }
});

module.exports = Map;
