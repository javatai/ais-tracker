"use strict";

var _ = require('underscore');

var diff = function (a, b) {
  var r = {};
  _.each(a, function(v, k) {
    if (b[k] === v) return;
    r[k] = v;
  });
  return r;
}

module.exports = diff;
