'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var ListView = require('./list-view');
var ShipView = require('./ship-view');

var template = require('./master-view.hbs');

var MasterView = Backbone.View.extend({
  template: template,

  events: {
    "keyup input": "filter",
    "focus input": "tolistview",
    "click .footer .tolist a": "tolistview"
  },

  initialize: function (options) {
    this.app = options.app;
    this.isOpen = false;
    this.shipviews = [];

    this.listenTo(this.app, 'clickout', this.closeview);
  },

  tolistview: function () {
    _.each(this.shipviews, function (view) {
      view.model.set('selected', false);
    });
    this.openlistview();
  },

  closeview: function () {
    if (this.isOpen === true) {
      this.$el.find('.collapse').collapse('hide');
    }
    this.isOpen = false;
  },

  openview: function () {
    if (this.isOpen === false) {
      this.$el.find('.collapse').collapse('show');
    }
    this.isOpen = true;
  },

  openlistview: function () {
    this.$el.find('.carousel').carousel(0);
    this.openview();

    var btn = this.$el.find('.footer li.tolist');
    $(btn).addClass('active');
  },

  closelistview: function () {
    var btn = this.$el.find('.footer li.tolist');
    $(btn).removeClass('active');
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

      this.openview();

      this.$el.find('.carousel-inner').append(shipview.$el);
      this.$el.find('.carousel').carousel(this.shipviews.length);
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

    this.listView = new ListView({
      collection: this.collection,
    });

    this.listView.render();

    this.$el.find('.carousel-inner').append(this.listView.$el);

    this.listenTo(this.collection, 'change:selected', this.selectShip);
  }
});

module.exports = MasterView;
