'use strict';

var $ = require('jquery');
var _ = require('underscore');

var View = require('../lib/view');
var template = require('./map-nav.hbs');

var MapNav = View.extend({
  tagName: 'div',
  template: template,
  className: 'map-nav',

  events: {
    "fastclick button" : "onClick"
  },

  onClick: function (el) {
    _.each(this.buttons, function (button) {
      if ($(el.currentTarget).hasClass(button.cls)) {
        this.trigger(button.trigger);
      }
    }, this);
  },

  initialize: function (options) {
    options = options || {};
    this.buttons = options.buttons && options.buttons.before || [];

    this.buttons.push({
      cls: 'zoom-in',
      trigger: 'zoomIn'
    });

    this.buttons.push({
      cls: 'zoom-out',
      trigger: 'zoomOut'
    });

    this.buttons.push({
      cls: 'home',
      trigger: 'toHome'
    });

    if (options.buttons && options.buttons.after) {
      this.buttons = this.buttons.concat(options.buttons.after);
    }

    this.render();
  },

  render: function () {
    this.$el.html(this.template({ buttons: this.buttons }));
    $('body').append(this.$el);
  }
});

module.exports = MapNav;

