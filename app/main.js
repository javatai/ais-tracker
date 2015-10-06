var _ = require('underscore');
var $ = require('jquery');
var bootstrap = require('bootstrap');
var MapUtil = require('./lib/MapUtil');
var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;

var AppEventDispatcher = _.clone(Backbone.Events);

var map = require('./map/map');

var Ships = require('./models/ship/collection');
var ships = new Ships();

var ShipsLayer = require('./map/ships-layer');
var shipsLayer = new ShipsLayer(null, {
  map: map,
  ships: ships,
  appevents: AppEventDispatcher
});

var MasterView = require('./views/master-view');
var masterView = new MasterView({
  el: $('#content'),
  collection: ships,
  appevents: AppEventDispatcher
});

masterView.render();
