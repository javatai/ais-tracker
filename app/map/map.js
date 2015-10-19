'use strict';

var config = require('../config').frontend.map;

var MapNav = require('./map-nav');

var mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = config.accessToken;

var map = new mapboxgl.Map({
  container: 'map',
  style: require('./style.json'),
  center: config.center,
  zoom: config.zoom
});

var mapNav = new MapNav({
  mapgl: map,
  selector: '.mapboxgl-ctrl-top-right'
})

window.mapgl = map;

module.exports = map;
