'use strict';

var config = require('../config').frontend.map;

var Maps = {
  'default': require('./mapboxgljs/map')
}

module.exports = Maps.hasOwnProperty(config.type) ? Maps[config.type] : Maps['default'];
