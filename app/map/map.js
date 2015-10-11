'use strict';

var config = require('../config.json');

var mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = config.map.accessToken;

var map = new mapboxgl.Map({
  container: 'map',
  style: config.map.style,
  center: config.map.center,
  zoom: config.map.zoom
});

window.mapgl = map;

map.addControl(new mapboxgl.Navigation());

module.exports = map;
