'use strict';

var _ = require('underscore');
var $ = require('jquery');

var BaseView = require('./base-view');

var ListView = require('./list-view');
var AboutView = require('./about-view');
var LogView = require('./log-view');

var template = require('./mobile-view.hbs');

var MobileView = BaseView.extend({
  template: template,

  events: {
    "keyup input[type='text']": "filter",
    "focus input[type='text']": "openlistview",
    "click .footer .tolist a":  "openlistview",
    "click .footer .toabout a": "openaboutview",
    "click .footer .tolog a":   "openlogview"
  },

  closeview: function () {
    if (this.shipview) {
      this.shipview.remove();
    }

    if (this.isOpen === true) {
      this.$el.find('.footer li').removeClass('active');
    }
    this.isOpen = false;

    this.listView.isShown = false;
    this.logView.isShown = false;
  },

  openview: function () {
    if (this.isOpen === false) {
      this.$el.find('.toclose').show();
    }
    this.isOpen = true;
  },

  render: function () {
    this.$el.html(this.template());
    this.$el.find('.carousel').carousel({
      interval: false,
      pause: false
    });

    this.listView = new ListView({
      collection: this.collection,
    });

    this.$el.find('.carousel-inner').append(this.listView.$el);

    this.logView = new LogView();
    this.$el.find('.carousel-inner').append(this.logView.$el);

    this.aboutView = new AboutView({
      app: this.app
    });
    this.$el.find('.carousel-inner').append(this.aboutView.$el);

    this.openlistview();

    this.listenTo(this.collection, 'change:selected', this.selectShip);
  }
});

module.exports = MobileView;
