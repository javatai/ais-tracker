'use strict';

var Backbone = require('backbone');

var Position = require('./model');

var Positions = Backbone.Collection.extend({
  url: '/api/positions',
  model: Position
});

module.exports = Positions;
