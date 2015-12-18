'use strict';

var Backbone = require('backbone');
var Shipdatum = require('./model');

var ShipData = Backbone.Collection.extend({
  model: Shipdatum
});

module.exports = ShipData;
