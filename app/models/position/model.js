var moment = require('moment');
var Backbone = require('backbone');
var MapUtil = require('../../lib/MapUtil');

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
        "coordinates": this.getCoordinates()
      },
      "properties": {
        "id": this.get('id'),
        "mapid": "position-" + this.get('id')
      }
    }
  },

  getCoordinates: function () {
    return [
      this.get('longitude'),
      this.get('latitude')
    ]
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
    this.label = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(this.getCoordinates())
      .setHTML(this.toTitle())
      .addTo(map);
  },

  hideLabel: function () {
    if (!this.label) {
      return;
    }
    try {
      this.label.remove();
      delete this.label;
    } catch (ex) { }
  }
});

module.exports = Position;
