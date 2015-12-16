'use strict';

var Socket = require('../../lib/socket');
var Map = require('../../map/map');

var _ = require('underscore');
var Backbone = require('backbone');
var GeographicLib = require('geographiclib');

var Positions = require('../position/collection');
var Position = require('../position/model');

var ShipData = require('../shipdata/collection');
var ShipDatum = require('../shipdata/model');

var Track = require('../track/collection');

var ShipHelper = require('./helper');
var ShipMarker = require('./marker');
var ShipLabel = require('./label');

var Ship = Backbone.RelationalModel.extend({
  idAttribute: "userid",

  shipHelper: null,
  shipLabel: null,
  shipMarker: null,

  defaults: {
    'mouseover': false,
    'selected': false
  },

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

  initialize: function () {
    this.listenTo(this, 'add', this.onAdd);
    this.listenTo(this, 'remove', this.onRemove);
    this.listenTo(this, 'change:position', this.onPositionChange);
    this.listenTo(this, 'change:selected', this.onSelect);
  },

  toTitle: function () {
    return this.getHelper().toTitle();
  },

  getHelper: function () {
    if (!this.shipHelper) {
      this.shipHelper =  new ShipHelper(this);
    }
    return this.shipHelper;
  },

  getMarker: function () {
    if (!this.shipMarker) {
      this.shipMarker =  new ShipMarker(this);
    }
    return this.shipMarker;
  },

  getLabel: function () {
    if (!this.shipLabel) {
      this.shipLabel = new ShipLabel({ model: this });
    }
    return this.shipLabel;
  },

  fetchTrack: function () {
    var collection = this.get('track');
    collection.reset();

    this.xhr = collection.fetch(this);

    return this.xhr;
  },

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

  affectedByLngLat: function (LngLat, min) {
    if (!this.has('position')) return false;

    var distanceTo = this.distanceTo(LngLat);
    var inPolygon = this.getMarker().latLngInPolygon(LngLat);

    return distanceTo < min || inPolygon;
  },

  onSocketHelper: function (data, key, Model) {
    var diff = false;

    if (!this.has(key)) {
      diff = true;
      this.set(key, new Model(data[key]));
    } else {
      diff = this.get(key).diff(data[key]);
      if (diff) {
        this.set(key, Model.findOrCreate(data[key]));
      }
    }

    return diff;
  },

  onSocket: function (data) {
    if (this.onSocketHelper(data, 'shipdata', ShipDatum)
      || this.onSocketHelper(data, 'position', Position)) {
      this.set('datetime', data.datetime);
    }
  },

  inView: function () {
    if (!this.has('position')) return false;

    var lnglat = this.get('position').getLngLat();
    return Map.inView(lnglat);
  },

  onPositionChange: function (ship, position) {
    var coordinate = position && position.getLngLat() || null;

    if (coordinate && !this.coordinate) {
      this.coordinate = coordinate;
      this.trigger('moved', position);
    } else if (this.get('selected')) {
      this.coordinate = coordinate;
      this.trigger('moved', position);
    } else if (this.inView()) {
      this.coordinate = coordinate;
      this.trigger('moved', position);
    } else {
      var geod = GeographicLib.Geodesic.WGS84;
      var distanceMoved = geod.Inverse(this.coordinate.lat, this.coordinate.lng, coordinate.lat, coordinate.lng).s12;
      if (distanceMoved > 50) {
        this.coordinate = coordinate;
        this.trigger('moved', position);
      }
    }
  },

  onAdd: function () {
    this.coordinate = this.has('position') && this.get('position').getLngLat() || null;

    this.start();

    this.getMarker();
    this.getLabel();
  },

  onRemove: function () {
    this.stop();

    this.set('selected', false);
    this.set('mouseover', false);

    if (this.shipHelper) {
      delete this.shipHelper;
    }
    if (this.shipMarker) {
      this.shipMarker.removeFromMap();
      delete this.shipMarker;
    }
    if (this.shipLabel) {
      this.shipLabel.hideLabel();
      delete this.shipLabel;
    }
  },

  onSelect: function (ship, selected) {
    if (selected) {
      this.set('mouseover', false);
    }
  },

  start: function () {
    if (this.socket) return;

    Socket.connect().done(_.bind(function (socket) {
      this.socket = socket;
      this.socket.on('ship:update:' + this.get('userid'), _.bind(this.onSocket, this));
    }, this));
  },

  stop: function () {
    if (!this.get('id')) return;

    this.set('selected', false);

    this.getMarker().removeFromMap();

    if (this.socket) {
      this.socket.removeListener('ship:update:' + this.get('userid'), _.bind(this.onSocket, this));

      this.socket = null;
    }
  },
});

module.exports = Ship;
