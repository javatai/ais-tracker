'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var ListView = require('./list-view');
var ShipView = require('./ship-view');
var AboutView = require('./about-view');
var LogView = require('./log-view');

var template = require('./desktop-view.hbs');

var MasterView = Backbone.View.extend({
  template: template,

  events: {
    "keyup input[type='text']": "filter",
    "focus input[type='text']": "openlistview",
    "click .footer .tolist a":  "openlistview",
    "click .footer .toabout a": "openaboutview",
    "click .footer .tolog a":   "openlogview",
    "click .footer .toclose a": "closeview"
  },

  initialize: function (options) {
    this.app = options.app;
    this.isOpen = false;

    this.render();

    this.listenTo(this.app, 'clickout', this.closeview);
    this.listenTo(this.app, 'startListening', this.onStart);
    this.listenTo(this.app, 'shopListening', this.onStop);
  },

  onStart: function () {
    this.listenTo(this.collection, 'remove', this.chkShipview);
  },

  onStop: function () {
    this.stopListening(this.collection, 'remove', this.chkShipview);
    this.closeview();
  },

  chkShipviews: function (ship) {
    if (this.shipview && this.shipview.model.get('id') === ship.get('id')) {
      if (this.isOpen) {
        this.openlistview();
      }
      this.shipview.remove();
    }
  },

  findCarouselIndexByClass: function (name) {
    var number = 0;
    this.$el.find('.item').each(function(index) {
      if ($(this).hasClass(name)) {
        number = index;
      }
    });
    return number;
  },

  updateFooter: function (name) {
    this.$el.find('.footer li').each(function () {
      if (name && $(this).hasClass(name)) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
  },

  closeview: function () {
    if (this.shipview) {
      this.shipview.remove();
    }

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
  },

  openviewhelper: function (cls, cntr) {
    if (!this.$el.find('.item.active').length) {
      this.$el.find('.item.'+cls).addClass('active');
    }

    var number = this.findCarouselIndexByClass(cls);
    this.$el.find('.carousel').carousel(number);
    this.openview();

    if (cls === 'listview') {
      this.logView.isShown = false;
      this.listView.isShown = true;
    } else if (cls === 'logview') {
      this.logView.isShown = true;
      this.listView.isShown = false;
    } else {
      this.logView.isShown = false;
      this.listView.isShown = false;
    }

    this.updateFooter(cntr);
  },

  openlistview: function () {
    this.openviewhelper('listview', 'tolist');
  },

  openaboutview: function () {
    this.openviewhelper('aboutview', 'toabout');
  },

  openlogview: function () {
    this.openviewhelper('logview', 'tolog');
  },

  filter: function (evt) {
    this.listView.filter(evt);
  },

  selectShip: function (ship, selected) {
    if (selected) {
      if (this.shipview) {
        this.shipview.remove();
      }

      this.shipview = new ShipView({
        model: ship
      });

      this.shipview.render();

      this.$el.find('.carousel-inner').append(this.shipview.$el);

      this.openview();

      if (!this.$el.find('.item.active').length) {
        this.$el.find('.item.shipview').addClass('active');
      } else {
        var number = this.findCarouselIndexByClass('shipview');
        this.$el.find('.carousel').carousel(number);
      }

      this.logView.isShown = false;
      this.listView.isShown = false;
      this.updateFooter();
    }
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

    this.listenTo(this.collection, 'change:selected', this.selectShip);
  }
});

module.exports = MasterView;
