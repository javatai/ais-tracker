var _ = require('underscore');
var $ = require('jquery');
var bootstrap = require('bootstrap');
var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;

var map = require('./map/map');

var AppEventDispatcher = _.clone(Backbone.Events);

var Ships = require('./models/ship/collection');
var ships = new Ships();
ships.once('sync', function () {
  Backbone.history.start();
});

window.ships = ships;

var Router = require('./lib/router');
var router = new Router({
  collection: ships,
  appevents: AppEventDispatcher
});

AppEventDispatcher.on('map:select', function (ship) {
  router.navigate('mmsi/' + ship.get('userid'));
});

AppEventDispatcher.on('map:selected', function (ship) {
  router.navigate('mmsi/' + ship.get('userid'));
});

AppEventDispatcher.on('map:unselected', function (ship) {
  router.navigate('');
});

var ShipsLayer = require('./map/ships-layer');
var shipsLayer = new ShipsLayer(null, {
  map: map,
  collection: ships,
  appevents: AppEventDispatcher
});

var MasterView = require('./views/master-view');
var masterView = new MasterView({
  el: $('#content'),
  collection: ships,
  appevents: AppEventDispatcher
});

masterView.render();


window.ships = ships;

