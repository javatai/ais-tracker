'use strict';

var _ = require('underscore');
var View = require('../../lib/view');

var Map = require('../map');

var Label = View.extend({
  onClick: _.noop,
  showLabel: _.noop,
  hideLabel: _.noop
});

module.exports = Label;
