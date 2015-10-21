'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var ShipView = require('./ship-view');
var ListView = require('./list-view');
var AboutView = require('./about-view');
var LogView = require('./log-view');

var template = require('./desktop-view.hbs');

var BaseView = Backbone.View.extend({
  template: template,

  closeview: _.noop,
  openview: _.noop,

  onStart: function () {
    this.listenTo(this.collection, 'remove', this.chkShipview);
  },

  onStop: function () {
    this.stopListening(this.collection, 'remove', this.chkShipview);
    this.closeview();
  },

  chkShipview: function (ship) {
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

module.exports = BaseView;
