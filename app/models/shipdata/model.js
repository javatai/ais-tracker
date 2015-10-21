'use strict';

var _ = require('underscore');
_.diff = require('../../lib/helper/diff');
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
  },

  diff: function (data) {
    if (data instanceof Backbone.RelationalModel) {
      data = data.toJSON();
    }

    var A = _.clone(this.attributes);
    delete A.raw;

    var B = _.clone(data);
    if (B) {
      delete B.raw;
    }

    var diff = _.diff(A, B);

    return !_.isEmpty(diff) && diff || false;
  }
});

module.exports = Shipdatum;
