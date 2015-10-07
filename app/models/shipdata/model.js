'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var ShipdataHelper = require('./helper');

var Shipdatum = Backbone.RelationalModel.extend({
  url: '/api/shipdata',

  parse: function (data, xhr) {
    data.raw = data.raw && JSON.parse(data.raw) || data.raw;
    return Backbone.RelationalModel.prototype.parse.call(this, data, xhr);
  },

  getHelper: function () {
    return new ShipdataHelper(this);
  }
});

module.exports = Shipdatum;
