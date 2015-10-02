var _ = require('underscore');
var Backbone = require('backbone');

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

  toFeature: function () {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": this.getCoordinates()
      },
      "properties": {
        "title": this.get('id') + ': ' + (this.has('shipdata') && this.get('shipdata').get('name') || this.get('userid')),
        "marker-symbol": "circle-stroked",
        "id": this.get('id'),
        "mapid": "marker-" + this.get('userid')
      }
    }
  },

  getCoordinates: function () {
    return [
      this.get('position').get('longitude'),
      this.get('position').get('latitude')
    ]
  },

  toTitle: function () {
    var title = this.has('shipdata') && this.get('shipdata').get('name') || this.get('userid');
    title += '<hr>';
    title += this.get('position').toTitle();

    return title;
  },

  label: null,
  showLabel: function (map) {
    this.label = new mapboxgl.Popup()
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

module.exports = Ship;
