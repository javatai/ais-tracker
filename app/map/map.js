'use strict';

var config = require('../config').frontend;

var Maps = {
  'default': require('./mapboxgljs/map'),
  'googlemapjs': require('./googlejs/map')
}

var map_type = process.env.MAP_TYPE || config.map_type;

var map = Maps.hasOwnProperty(map_type) ? new (Maps[map_type])() : new (Maps['default'])();

module.exports = map;
