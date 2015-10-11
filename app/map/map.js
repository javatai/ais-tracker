'use strict';

var config = require('../config').frontend.map;

var mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = config.accessToken;

var map = new mapboxgl.Map({
  container: 'map',
  style: config.style,
  center: config.center,
  zoom: config.zoom
});

window.mapgl = map;

map.addControl(new mapboxgl.Navigation());

module.exports = map;
