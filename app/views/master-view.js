'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var ListView = require('./list-view');
var ShipView = require('./ship-view');
var AboutView = require('./about-view');

var template = require('./master-view.hbs');

var MasterView = Backbone.View.extend({
  template: template,

  events: {
    "keyup input": "filter",
    "focus input": "tolistview",
    "click .footer .tolist a": "tolistview",
    "click .footer .toabout a": "openaboutview",
    "click .footer .toclose a": "closeview"
  },

  initialize: function (options) {
    this.app = options.app;
    this.isOpen = false;
    this.shipviews = [];

    this.render();

    this.listenTo(this.app, 'clickout', this.closeview);
    this.listenTo(this.collection, 'remove', this.chkShipviews);
  },

  chkShipviews: function (ship) {
    _.each(this.shipviews, function (view, index) {
      if (view.model.get('id') === ship.get('id')) {
        this.openlistview();
        this.$el.find('.carousel').on('slid.bs.carousel', _.bind(function () {
          this.shipviews.splice(index, 1);
          view.remove();
        }, this));
      }
    }, this);
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
    if (this.isOpen === true) {
      this.$el.find('.collapse').collapse('hide');
      this.$el.find('.toclose').hide();
      this.$el.find('.footer li').removeClass('active');
    }
    this.isOpen = false;

    this.listView.isShown = false;
  },

  openview: function () {
    if (this.isOpen === false) {
      this.$el.find('.collapse').collapse('show');
      this.$el.find('.toclose').show();
    }
    this.isOpen = true;
  },

  tolistview: function () {
    _.each(this.shipviews, function (view) {
      view.model.set('selected', false);
    });
    this.openlistview();
  },

  openlistview: function () {
    if (!this.$el.find('.item.active').length) {
      this.$el.find('.item.listview').addClass('active');
    }
    var number = this.findCarouselIndexByClass('listview');
    this.$el.find('.carousel').carousel(number);
    this.openview();

    this.listView.isShown = true;

    this.updateFooter('tolist');
  },

  openaboutview: function () {
    if (!this.$el.find('.item.active').length) {
      this.$el.find('.item.aboutview').addClass('active');
    }
    var number = this.findCarouselIndexByClass('aboutview');
    this.$el.find('.carousel').carousel(number);
    this.openview();

    this.listView.isShown = false;

    this.updateFooter('toabout');
  },

  closelistview: function () {
    this.listView.isShown = false;

    this.updateFooter();
  },

  filter: function (evt) {
    this.tolistview();
    this.listView.filter(evt);
  },

  selectShip: function (ship, selected) {
    if (selected) {
      var shipview = new ShipView({
        model: ship
      });

      shipview.render();
      this.shipviews.push(shipview);

      this.$el.find('.carousel-inner').append(shipview.$el);

      this.openview();

      if (!this.$el.find('.item.active').length) {
        this.$el.find('.item.shipview').addClass('active');
      } else {
        var number = this.findCarouselIndexByClass('shipview');
        this.$el.find('.carousel').carousel(number);
      }

      this.closelistview();
    }
  },

  cleanup: function () {
    if (this.shipviews.length > 1) {
      var shipview = this.shipviews.splice(0, 1);
      shipview[0].remove();
    }
  },

  render: function () {
    this.$el.html(this.template());
    this.$el.find('.carousel').carousel({
      interval: false,
      pause: false
    });
    this.$el.find('.carousel').on('slid.bs.carousel', _.bind(this.cleanup, this));

    this.aboutView = new AboutView();
    this.$el.find('.carousel-inner').append(this.aboutView.$el);

    this.listView = new ListView({
      collection: this.collection,
    });
    this.$el.find('.carousel-inner').append(this.listView.$el);

    this.listenTo(this.collection, 'change:selected', this.selectShip);
  }
});

module.exports = MasterView;
