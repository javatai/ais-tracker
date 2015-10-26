'use strict';

var config = require('../config').frontend;

var Labels = {
  'default': require('./mapboxgljs/label'),
  'googlejs': require('./googlejs/label')
}

var map_type = process.env.MAP_TYPE || config.map_type;

module.exports = Labels.hasOwnProperty(map_type) ? Labels[map_type] : Labels['default'];
