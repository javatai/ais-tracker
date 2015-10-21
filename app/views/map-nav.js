'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var template = require('./map-nav.hbs');

var MapNav = Backbone.View.extend({
  tagName: 'div',
  template: template,
  className: 'map-nav',

  events: {
    "click button" : "onClick"
  },

  onClick: function (el) {
    _.each(this.buttons, function (button) {
      if ($(el.currentTarget).hasClass(button.cls)) {
        this.trigger(button.trigger);
      }
    }, this);
  },

  initialize: function (options) {
    this.container = options.container;

    this.buttons = options.buttons || [];

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

    this.buttons.push({
      cls: 'screenshot',
      trigger: 'toNorth'
    });

    this.render();
  },

  render: function () {
    this.$el.html(this.template({ buttons: this.buttons }));
    this.container.append(this.$el);
  }
});

module.exports = MapNav;

