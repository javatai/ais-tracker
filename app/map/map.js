'use strict';

var config = require('../config.json');

mapboxgl.accessToken = config.map.accessToken;

var map = new mapboxgl.Map({
  container: 'map',
  style: config.map.style,
  center: config.map.center,
  zoom: config.map.zoom
});

map.addControl(new mapboxgl.Navigation());

module.exports = map;
