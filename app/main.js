var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;

var MapUtil = require('./lib/MapUtil');

var map = require('./map/map');

var Ships = require('./models/ship/collection');
var ships = new Ships();

window.ships = ships;

var ShipsLayer = require('./map/ships-layer');
var shipsLayer = new ShipsLayer(null, {
  map: map,
  ships: ships
});
