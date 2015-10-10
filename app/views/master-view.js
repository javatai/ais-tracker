'use strict';

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
    this.app = options.app;

    this.listenTo(this.app, 'clickout', this.clickout);
  },

  clickout: function () {
    if (this.currenttab != 'list') {
      this.closeshipview();
    } else {
      this.closelistview();
    }
  },

  setShipTabTitel: function (tab) {
    if (this.shipView) {
      this.$el.find('.footer li.toship a').html(this.shipView.model.getHelper().toTitel());
    } else {
      this.$el.find('.footer li.toship a').html('');
    }
  },

  openlistview: function () {
    this.$el.find('.list .collapse').collapse('show');
    var btn = this.$el.find('.footer li.tolist');
    $(btn).addClass('active');
    this.$el.addClass('open');
  },

  closelistview: function () {
    this.$el.find('.list .collapse').collapse('hide');
    var btn = this.$el.find('.footer li.tolist');
    $(btn).removeClass('active');
    this.$el.removeClass('open');
  },

  openshipview: function () {
    this.$el.find('.ship .collapse').collapse('show');
    var btn = this.$el.find('.footer li.toship');
    $(btn).addClass('active');
    this.$el.addClass('open');
  },

  closeshipview: function () {
    this.$el.find('.ship .collapse').collapse('hide');
    var btn = this.$el.find('.footer li.toship');
    $(btn).removeClass('active');
    this.$el.removeClass('open');
  },

  filter: function (evt) {
    this.listView.filter(evt);
  },

  render: function () {
    this.$el.html(this.template());

    this.listView = new ListView({
      collection: this.collection,
      el: this.$el.find('.list-table')
    });

    this.listView.render();
  }
});

module.exports = MasterView;
