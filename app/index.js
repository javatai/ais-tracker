var $ = require('jquery');
var _ = require('underscore');

var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;

var App = require('./app');
var app = new App();

var Ships = require('./model/ship/collection');
var ships = new Ships();

var ShipLayer = require('./map/layer/ship-layer');
var shipLayer = new ShipLayer(ships);

var ShapeLayer = require('./map/layer/shape-layer');
var shapeLayer = new ShapeLayer(ships);

var TrackLayer = require('./map/layer/track-layer');
var trackLayer = new TrackLayer(ships);

var Log = require('./log');
var log = new Log(ships);

var Map = require('./map/map');

Map.onReady().done(function () {
  ships.run();
});
