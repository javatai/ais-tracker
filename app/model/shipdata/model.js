'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Shipdatum = Backbone.RelationalModel.extend({
  idAttribute: "userid"
});

module.exports = Shipdatum;
