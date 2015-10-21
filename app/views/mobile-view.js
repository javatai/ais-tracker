'use strict';

var _ = require('underscore');
var $ = require('jquery');

var BaseView = require('./base-view');
var template = require('./mobile-view.hbs');

var MobileView = BaseView.extend({
  template: template,

  events: {
    "keyup input[type='text']": "filter",
    "focus input[type='text']": "openlistview",
    "click .footer .tolist a":  "openlistview",
    "click .footer .toabout a": "openaboutview",
    "click .footer .tolog a":   "openlogview",
    'click .menu-close':        "slideIn",
  },

  initialize: function (options) {
    this.app = options.app;
    this.isOpen = true;

    this.render();

    this.listenTo(this.app, 'startListening', this.onStart);
    this.listenTo(this.app, 'shopListening', this.onStop);
  },

  slideIn: function () {
    $('#content').removeClass('is-visible');
  },

  slideOut: function () {
    $('#content').addClass('is-visible');
  },

  render: function () {
    BaseView.prototype.render.call(this);
    this.openlistview();
  }
});

module.exports = MobileView;
