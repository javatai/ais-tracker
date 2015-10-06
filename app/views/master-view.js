var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var ListView = require('./list-view');
var ShipView = require('./ship-view');

var template = require('./master-view.hbs');

var MasterView = Backbone.View.extend({
  template: template,
  currenttab: 'list',

  events: {
    "keyup input": "filter",
    "focus input": "openlistview",
    "click .footer .tolist a": "openlistview",
    "click .footer .toship:not(.disabled) a": "openshipview"
  },

  initialize: function (options) {
    this.options = options;
    this.appevents = options.appevents;
  },

  isOpen: function () {
    this.$el.addClass('open');
  },

  isClosed: function () {
    this.$el.removeClass('open');
  },

  setCurrentTab: function (tab) {
    this.isOpen();
    this.currenttab = tab;
    var cls = 'to' + tab;
    _.each(this.$el.find('.footer li'), function (el) {
      var $el = $(el);
      if ($el.hasClass('active') && !$el.hasClass(cls)) {
        $el.removeClass('active');
      }
      if (!$el.hasClass('active') && $el.hasClass(cls)) {
        $el.addClass('active');
      }
      if ($el.hasClass('disabled') && $el.hasClass(cls)) {
        $el.removeClass('disabled');
      }
    });

    if (this.shipView) {
      this.$el.find('.footer li.toship a').html(this.shipView.model.getHelper().toTitel());
    }
  },

  openlistview: function () {
    this.$el.find('.list .collapse').collapse('show');
    this.$el.find('.ship .collapse').collapse('hide');
    this.setCurrentTab('list');
  },

  closelistview: function () {
    this.$el.find('.list .collapse').collapse('hide');
    this.isClosed();
  },

  openshipview: function () {
    this.$el.find('.list .collapse').collapse('hide');
    this.$el.find('.ship .collapse').collapse('show');
    this.setCurrentTab('ship');
  },

  closeshipview: function () {
    this.$el.find('.ship .collapse').collapse('hide');
    this.isClosed();
  },

  filter: function (evt) {
    this.openlistview();
    this.listView.filter(evt);
  },

  selectShip: function (ship) {
    var id = ship.get('id');

    this.shipView = new ShipView({
      model: ship,
      el: this.$el.find('.ship-details')
    });

    this.shipView.render();
    this.openshipview();
  },

  selectShipEmit: function (ship) {
    this.$el.find('.ship .collapse').one('shown.bs.collapse', _.bind(function () {
      this.appevents.trigger('map:select', ship);
    }, this));

    this.selectShip(ship);
  },

  handlerInList: function () {
    this.openlistview();
  },

  handlerInShip: function () {
    if (this.shipView) {
      this.openshipview();
    } else {
      this.openlistview();
    }
  },

  handlerOut: function () {
    if (this.currenttab != 'list') {
      this.closeshipview();
    } else {
      this.closelistview();
    }
  },

  render: function () {
    this.$el.html(this.template());
    this.$el.find('.header').on("mouseenter", _.bind(this.handlerInList, this));

    this.listView = new ListView({
      collection: this.collection,
      el: this.$el.find('.list-table')
    });

    this.listenTo(this.listView, "select", this.selectShipEmit);
    this.listenTo(this.appevents, "map:selected", this.selectShip);
    this.listenTo(this.appevents, "map:unselected", this.handlerOut);

    this.listView.render();
  },

  destroy: function () {
    this.$el.find('.header').off("mouseenter", _.bind(this.handlerInList, this));
  }
});

module.exports = MasterView;
