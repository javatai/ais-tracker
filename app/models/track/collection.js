var _ = require('underscore');
var Positions = require('../position/collection');

var Track = Positions.extend({
  id: null,

  url: function () {
    if (!this.id) {
      throw 'Track: No Id specified';
    }
    return '/api/track/' + this.id;
  },

  setId: function (id) {
    this.id = id;
  },

  trackSource: null,
  trackLayer: null,

  addTo: function (map, options) {
    options = options || {};

    var trackdata = {
      "type": "LineString",
      "coordinates": this.map(function (position) {
        return position.getCoordinate();
      })
    };

    var data = [];
    this.each(function (position, index) {
      if (index < this.length-1) {
        var feature = position.toFeature();
        feature.properties.shipid = this.id;
        data.push(feature);
      }
    }, this);

    var positiondata = {
      "type": "FeatureCollection",
      "features": data
    };

    if (map.getSource("track")) {
        map.getSource("track").setData(trackdata);
        map.getSource("positions").setData(positiondata);
      return;
    }

    this.trackSource = map.addSource("track", {
      "type": "geojson",
      "data": trackdata
    });

    this.trackLayer = map.addLayer({
      "id": "track",
      "type": "line",
      "source": "track",
      "paint": {
        "line-color": "#888",
        "line-width": 3
      }
    }, "ships");

    this.PositionSource = map.addSource("positions", {
      "type": "geojson",
      "data": positiondata
    });

    this.PositionLayer = map.addLayer({
      "id": "positions",
      "type": "circle",
      "source": "positions",
      "interactive": true
    }, "ships");
  },

  removeFrom: function (map) {
    if (map.getSource("track")) {
      map.removeSource("track");
      map.removeLayer("track");
    }

    if (map.getSource("positions")) {
      map.removeSource("positions");
      map.removeLayer("positions");
    }

    delete this.trackSource;
    delete this.trackLayer;
    delete this.PositionSource;
    delete this.PositionLayer;

    this.reset();
  },

  getPositionsForLngLat: function (LngLat, min) {
    return this.filter(function (position) {
      return position.distanceTo(LngLat) < min;
    });
  }
});

module.exports = Track;