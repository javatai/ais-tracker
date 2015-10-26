'use strict';

var config = require('../../config').frontend.googlejs;

var Platform = require('../../lib/platform');

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var GeographicLib = require('geographiclib');

var Base64 = require('js-base64').Base64;
var Marker = require('./arrow.hbs');
var Position = require('./triangle.hbs');

var Map = function (options) {
  this.map = undefined;

  this.shapes = { };
  this.reception = { };
  this.markers = { };
  this.track = { };
  this.positions = { };

  this.perimeter = -1;
  this.px = { };

  window.initMap = _.bind(this.initMap, this);
  this.onReadyMap = $.Deferred();

  var _body = document.getElementsByTagName("body")[0],
    _script = document.createElement('script');
    _script.type = 'text/javascript';
    _script.src = 'https://maps.googleapis.com/maps/api/js?key=' + config.apiKey + '&callback=initMap';
  _body.appendChild(_script);
};

_.extend(Map.prototype, Backbone.Events, {
  initMap: function () {
    require('./maplabel');

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: config.center,
      zoom: config.zoom,
      disableDefaultUI: true
    });

    google.maps.event.addListener(this.map, 'zoom_changed', _.bind(this.onZoom, this));

    google.maps.event.addListener(this.map, 'mousemove', _.bind(this.propagateMousemove, this));
    google.maps.event.addListener(this.map, 'click', _.bind(this.propagateClick, this));

    this.encode = require('../../contrib/geojson-google-maps.js')(google);

    this.onReadyMap.resolve();
  },

  getMap: function () {
    return this.map;
  },

  resetCursor: function () {
  },

  setCursor: function (style) {
  },

  propagateMousemove: function (e) {
    e.lngLat = { lng: e.latLng.lng(), lat: e.latLng.lat() };
    this.trigger('mousemove', e);
  },

  propagateClick: function (e) {
    e.lngLat = { lng: e.latLng.lng(), lat: e.latLng.lat() };
    this.trigger('click', e);
  },

  onReady: function () {
    if (this.map) {
      this.onReadyMap.resolve();
    }
    return this.onReadyMap.promise();
  },

  zoomIn: function () {
    var zoom = this.map.getZoom();
    this.map.setZoom(zoom + 1);
  },

  zoomOut: function () {
    var zoom = this.map.getZoom();
    if (zoom === 0) return;
    this.map.setZoom(zoom - 1);
  },

  toHome: function () {
    this.map.panTo(config.center);
    this.map.setZoom(config.zoom);
  },

  onZoom: function () {
    this.perimeter = -1;
  },

  inView: function (lnglat) {
    if (!this.map) return;

    var bounds = this.map.getBounds();

    if (!bounds) return;

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    if (this.map.getZoom() >= 14
      && (ne.lat() > lnglat.lat
        || ne.lng() > lnglat.lng
        || sw.lat() < lnglat.lat
        || sw.lng() < lnglat.lng)) {
      return true;
    }

    return false;
  },

  calculatePerimeter: function () {
    if (this.perimeter > 0) {
      return this.perimeter;
    }

    var bounds = this.map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var geod = GeographicLib.Geodesic.WGS84;

    var dist = Math.round(geod.Inverse(ne.lat(), ne.lng(), sw.lat(), sw.lng()).s12);
    var width = $('body').width();

    this.perimeter = 15 * (dist/width);

    return this.perimeter;
  },

  _triggerMousemove: function (e) {
    google.maps.event.trigger(this.map, 'mousemove', e);
  },

  _triggerClick: function (e) {
    google.maps.event.trigger(this.map, 'click', e);
  },

  _registerEventPropagation: function (feature) {
    feature.listeners = {
      mousemove: google.maps.event.addListener(feature, 'mousemove', _.bind(this._triggerMousemove, this)),
      click: google.maps.event.addListener(feature, 'click', _.bind(this._triggerClick, this))
    }
  },

  _unregisterEventPropagation: function (feature) {
    _.each(feature.listeners, function (listener) {
      google.maps.event.removeListener(listener);
    }, this);
  },

  addMarkerToMap: function (layer, data) {
    var ids = [];
    var symbols = _.map(data.features, function (feature) {
      ids.push(feature.properties.id);

      var marker = Marker({
        angle: feature.properties.angle,
        fill: feature.properties.selected ? '#FFFFFF' : 'none'
      });

      return {
        "icon": {
          "url": 'data:image/svg+xml;base64,' + Base64.encode(marker),
          "origin": new google.maps.Point(0, 0),
          "anchor": new google.maps.Point(10, 10)
        },
        "position": {
          "lat": feature.geometry.coordinates[1],
          "lng": feature.geometry.coordinates[0]
        },
        "id": feature.properties.id,
        "_title": String(feature.properties.title),
        "zIndex": 100
      }
    });

    _.each(symbols, function (symbol) {
      if (!this.markers.hasOwnProperty(symbol.id)) {
        this.markers[symbol.id] = new google.maps.Marker(_.extend(symbol, { map: this.map }));
        this._registerEventPropagation(this.markers[symbol.id]);

        this.markers[symbol.id].maplabel = new MapLabel({
          "map": this.map,
          "text": symbol._title,
          "maxZoom": 22,
          "minZoom": 14,
          "zIndex": 99,
          "position": new google.maps.LatLng(symbol.position.lat, symbol.position.lng)
        });
      } else {
        this.markers[symbol.id].setPosition(symbol.position);
        this.markers[symbol.id].setIcon(symbol.icon);
      }
    }, this);

    _.each(_.difference(Object.keys(this.markers), ids), function (id) {
      this._unregisterEventPropagation(this.markers[id]);
      this.markers[id].maplabel.setMap(null);
      delete this.markers[id].maplabel;
      this.markers[id].setMap(null);
      delete this.markers[id];
    }, this);
  },

  addShapeToMap: function (layer, data) {
    var name = layer.name;

    if (!this.shapes.hasOwnProperty(name)) {
      var options = {
        "strokeOpacity": 0,
        "strokeWeight": 0,
        "fillColor": layer.json.paint['fill-color'],
        "fillOpacity": 1,
        "zIndex": 90
      }

      this.shapes[name] = this.encode(data, options);

      if (this.shapes[name].error){
        console.error(this.shapes[name].error);
      } else {
        this.shapes[name].setMap(this.map);
        this._registerEventPropagation(this.shapes[name]);
      }
    } else {
      this._unregisterEventPropagation(this.shapes[name]);
      this.shapes[name].setMap(null);
      delete this.shapes[name];

      this.addShapeToMap(layer, data);
    }
  },

  addReceptionLayerToMap: function (layer, data) {
    var name = layer.name;

    if (!this.reception.hasOwnProperty(name)) {
      var options = {
        "strokeOpacity": 0,
        "strokeWeight": 0,
        "fillColor": layer.json.paint['fill-color'],
        "fillOpacity": 1,
        "zIndex": 80
      }

      this.reception[name] = this.encode(data, options);

      if (this.reception[name].error){
        console.error(this.reception[name].error);
      } else {
        this.reception[name].setMap(this.map);
        this._registerEventPropagation(this.reception[name]);
      }
    } else {
      this._unregisterEventPropagation(this.reception[name]);
      this.reception[name].setMap(null);
      delete this.reception[name];

      this.addReceptionLayerToMap(layer, data);
    }
  },

  addTrackToMap: function (layer, data) {
    var name = layer.name;

    if (this.track.hasOwnProperty(name)) {
      this.removeTrackFromMap();
    }

    var options = {
      "strokeOpacity": 1,
      "strokeWeight": layer.json.paint['line-width'],
      "strokeColor": layer.json.paint['line-color'],
      "zIndex": 94
    }

    this.track[name] = this.encode(data, options);

    if (this.track[name].error){
      console.error(this.track[name].error);
    } else {
      this.track[name].setMap(this.map);
      this._registerEventPropagation(this.track[name]);
    }
  },

  addPositionsToMap: function (layer, data) {
    var ids = [];
    var symbols = _.map(data.features, function (feature) {
      ids.push(feature.properties.id);

      var marker = Position({
        angle: feature.properties.angle
      });

      return {
        "icon": {
          "url": 'data:image/svg+xml;base64,' + Base64.encode(marker),
          "origin": new google.maps.Point(0, 0),
          "anchor": new google.maps.Point(10, 10)
        },
        "position": {
          "lat": feature.geometry.coordinates[1],
          "lng": feature.geometry.coordinates[0]
        },
        "id": feature.properties.id,
        "zIndex": 96
      }
    });

    _.each(symbols, function (symbol) {
      if (!this.positions.hasOwnProperty(symbol.id)) {
        this.positions[symbol.id] = new google.maps.Marker(_.extend(symbol, { map: this.map }));
        this._registerEventPropagation(this.positions[symbol.id]);
      }
    }, this);

    _.each(_.difference(Object.keys(this.positions), ids), function (id) {
      this._unregisterEventPropagation(this.positions[id]);
      this.positions[id].setMap(null);
      delete this.positions[id];
    }, this);
  },

  addToMap: function (conf) {
    var hasid = conf.name.indexOf('-');
    var type = hasid > 0 ? conf.name.substr(0, conf.name.indexOf('-')) : conf.name;

    var strategies = {
      markers: this.addMarkerToMap,
      shape: this.addShapeToMap,
      reception: this.addReceptionLayerToMap,
      track: this.addTrackToMap,
      positions: this.addPositionsToMap
    }

    var data = conf.data;
    if (strategies.hasOwnProperty(type)) {
      _.each(conf.layer, function (layer) {
        strategies[type].call(this, layer, data);
      }, this);
    }
  },

  removeMarkerFromMap: function (id) {
    _.each(Object.keys(this.markers), function (id) {
      this._unregisterEventPropagation(this.markers[id]);
      this.markers[id].maplabel.setMap(null);
      delete this.markers[id].maplabel;
      this.markers[id].setMap(null);
      delete this.markers[id];
    }, this);
  },

  removeShapeFromMap: function (id) {
    if (!this.shapes.hasOwnProperty(id)) return;

    this._unregisterEventPropagation(this.shapes[id]);
    this.shapes[id].setMap(null);
    delete this.shapes[id];
  },

  removeReceptionLayerToMap: function (id) {
    if (!this.reception.hasOwnProperty(id)) return;

    this._unregisterEventPropagation(this.reception[id]);
    this.reception[id].setMap(null);
    delete this.reception[id];
  },

  removeTrackFromMap: function () {
    _.each(Object.keys(this.track), function (id) {
      this._unregisterEventPropagation(this.track[id]);
      this.track[id].setMap(null);
      delete this.track[id];
    }, this);
  },

  removePositionsFromMap: function (id) {
    _.each(Object.keys(this.positions), function (id) {
      this._unregisterEventPropagation(this.positions[id]);
      this.positions[id].setMap(null);
      delete this.positions[id];
    }, this);
  },

  removeFromMap: function (conf) {
    var hasid = conf.name.indexOf('-');
    var type = hasid > 0 ? conf.name.substr(0, conf.name.indexOf('-')) : conf.name;

    var strategies = {
      markers: this.removeMarkerFromMap,
      shape: this.removeShapeFromMap,
      reception: this.removeReceptionLayerToMap,
      track: this.removeTrackFromMap,
      positions: this.removePositionsFromMap
    }

    var data = conf.data;
    if (strategies.hasOwnProperty(type)) {
      _.each(conf.layer, function (layer) {
        strategies[type].call(this, conf.name);
      }, this);
    }
  },

  setPaintProperty: function (id, name, value) {
    if (!this.shapes.hasOwnProperty(id)) return;

    if (name === 'fill-color') {
      this.shapes[id].setOptions({ "fillColor": value });
    }
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

    var SW = { lat: P.lat2, lng: P.lon2 };
    var NE = { lat: N.lat2, lng: E.lon2 };

    return new google.maps.LatLngBounds(SW, NE);
  },

  center: function (lnglat) {
    this.onReady().done(_.bind(function () {
      if (!Platform.isMobile) {
        var bounds = this.calculateOffsetBounds(lnglat);
        this.map.fitBounds(bounds);
      } else {
        this.map.panTo(lnglat);
        this.map.setZoom(15);
      }
    }, this));
  },

  getLngLat: function (position) {
    return { lat: position.get('latitude'), lng: position.get('longitude') };
  },

  moveIntoView: function (position) {
    var lnglat = position.getLngLat();
    var bounds = this.map.getBounds();

    if (bounds.getNorthEast().lat() < lnglat.lat) {
      // console.log('N', bounds.getNorth(), lnglat.lat, bounds.getNorth() < lnglat.lat);
      this.map.panTo(lnglat);
    }

    if (bounds.getNorthEast().lng() < lnglat.lng) {
      // console.log('E', bounds.getEast(), lnglat.lng, bounds.getEast() < lnglat.lng);
      this.map.panTo(lnglat);
    }

    if (bounds.getSouthWest().lat() > lnglat.lat) {
      // console.log('S', bounds.getSouth(), lnglat.lat, bounds.getSouth() > lnglat.lat);
      this.map.panTo(lnglat);
    }

    if (bounds.getSouthWest().lng() > lnglat.lng) {
      // console.log('W', bounds.getWest(), lnglat.lng, bounds.getWest() > lnglat.lng);
      this.map.panTo(lnglat);
    }
  }
});

module.exports = Map;
