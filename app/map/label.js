'use strict';

var config = require('../config').frontend.map;

var Labels = {
  'default': require('./mapboxgljs/label')
}

module.exports = Labels.hasOwnProperty(config.type) ? Labels[config.type] : Labels['default'];
