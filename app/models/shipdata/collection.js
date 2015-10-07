'use strict';

var Backbone = require('backbone');

var ShipDatum = require('./model');

var ShipData = Backbone.Collection.extend({
  url: '/api/shipdata',
  model: ShipDatum
});

module.exports = ShipData;
