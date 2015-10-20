'use strict';

var Backbone = require('backbone');
var ShipDatum = require('./model');

var ShipData = Backbone.Collection.extend({
  model: ShipDatum
});

module.exports = ShipData;
