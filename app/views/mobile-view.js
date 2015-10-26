'use strict';

var $ = require('jquery');
var _ = require('underscore');

var BaseView = require('./base-view');
var template = require('./mobile-view.hbs');

var MobileView = BaseView.extend({
  template: template,

  events: {
    "keyup input[type='text']":     "filter",
    "focus input[type='text']":     "openlistview",

    "fastclick .footer .tolist a":  "openlistview",
    "fastclick .footer .toship a":  "openshipview",
    "fastclick .footer .toabout a": "openaboutview",
    "fastclick .footer .tolog a":   "openlogview",

    "fastclick .menu-close":        "slideIn",
    "click .shiplist tbody tr":     "slideIn",
    "click .loglist tbody tr":      "slideIn"
  },

  prevent: function (e) {
    e.preventDefault();
    e.stopPropagation();
  },

  initialize: function (options) {
    this.app = options.app;
    this.isOpen = true;

    this.render();

    this.listenTo(this.app, 'clickout', this.destroyShipview);
    this.listenTo(this.app, 'startListening', this.onStart);
    this.listenTo(this.app, 'shopListening', this.onStop);
  },

  onStop: function () {
    BaseView.prototype.onStop.call(this);
    this.destroyShipview();
    this.openlistview();
    this.slideIn();
  },

  slideIn: function (e) {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    $('#content').removeClass('is-visible');
  },

  slideOut: function (e) {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    $('#content').addClass('is-visible');
  },

  render: function () {
    BaseView.prototype.render.call(this);
    this.openlistview();
  }
});

module.exports = MobileView;
