var _ = require('underscore');
var moment = require('moment');
var Backbone = require('backbone');
var MapUtil = require('../../lib/MapUtil');

var Popup = require('../../map/popup');

var Position = Backbone.RelationalModel.extend({
  url: '/api/position',
  parse: function (data, xhr) {
    data.raw = data.raw && JSON.parse(data.raw) || data.raw;
    return Backbone.RelationalModel.prototype.parse.call(this, data, xhr);
  },

  toFeature: function () {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": this.getCoordinate()
      },
      "properties": {
        "id": this.get('id'),
        "mapid": "position-" + this.get('id')
      }
    }
  },

  getCoordinate: function () {
    return [
      this.get('longitude'),
      this.get('latitude')
    ]
  },

  getLngLat: function () {
    return {
      lng: this.get('longitude'),
      lat: this.get('latitude')
    }
  },

  get: function (name) {
    if (name === 'timestamp') {
      var timestamp = moment.utc(this.attributes.datetime);
      timestamp.seconds(this.attributes.timestamp);
      return timestamp.format("YYYY-MM-DD HH:mm:ss UTC");
    }
    return Backbone.RelationalModel.prototype.get.apply(this, arguments);
  },

  toTitle: function () {
    var title = [
      MapUtil.decimalLngToDms(this.get('longitude')),
      MapUtil.decimalLatToDms(this.get('latitude')),
      this.get('timestamp')
    ];

    return title.join('<br>');
  },

  label: null,
  showLabel: function (map) {
    if (this.label) {
      return;
    }
    this.label = new Popup()
      .setLngLat(this.getCoordinate())
      .setHTML(this.toTitle())
      .addClass('position-label')
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
    var coords = this.getLngLat();
    return MapUtil.distance(LngLat.lat, LngLat.lng, coords.lat, coords.lng);
  }
});

module.exports = Position;
