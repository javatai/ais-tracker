'use strict';

var _ = require('underscore');
var $ = require('jquery');

var BaseView = require('./base-view');
var template = require('./desktop-view.hbs');

var DesktopView = BaseView.extend({
  template: template,

  events: {
    "keyup input[type='text']": "filter",
    "focus input[type='text']": "openlistview",

    "fastclick .footer .tolist a":  "openlistview",
    "fastclick .footer .toship a":  "openshipview",
    "fastclick .footer .toabout a": "openaboutview",
    "fastclick .footer .tolog a":   "openlogview",

    "click .footer .toclose a": "closeview"
  },

  initialize: function (options) {
    this.app = options.app;
    this.isOpen = false;

    this.render();

    this.listenTo(this.app, 'clickout', this.destroyShipview);
    this.listenTo(this.app, 'startListening', this.onStart);
    this.listenTo(this.app, 'shopListening', this.onStop);
  },

  onStop: function () {
    BaseView.prototype.onStop.call(this);
    this.destroyShipview();
    this.closeview();
  },

  closeview: function () {
    if (this.isOpen === true) {
      this.$el.find('.collapse').collapse('hide');
      this.$el.find('.toclose').hide();
      this.$el.find('.footer li').removeClass('active');
    }
    this.isOpen = false;

    this.listView.isShown = false;
    this.logView.isShown = false;
  },

  openview: function () {
    if (this.isOpen === false) {
      this.$el.find('.collapse').collapse('show');
      this.$el.find('.toclose').show();
    }
    this.isOpen = true;
  }
});

module.exports = DesktopView;
