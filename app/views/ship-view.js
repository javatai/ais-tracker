'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var template = require('./ship-view.hbs');

var ShipDetailsView = require('./ship-details');
var ShipPositionView = require('./ship-position');
var ShipTrackView = require('./ship-track');

var ShipView = Backbone.View.extend({
  tagName: 'div',
  className: 'item',
  template: template,

  events: {
    "click a[href='#shipdetails']": "chkShipdata",
    "click a[href='#lastposition']": "chkPosition",
    "click a[href='#track']": "chkTrack"
  },

  chkShipdata: function (e) {
    if (!this.model.has('shipdata')) {
      e.stopPropagation();
    }
  },

  chkPosition: function (e) {
    if (!this.model.has('position')) {
      e.stopPropagation();
    }
  },

  chkTrack: function (e) {
    if (!this.model.get('track').length) {
      e.stopPropagation();
    }
  },

  trackTab: function () {
    if (this.model.get('track').length) {
      this.$el.find('.nav-tabs .track').removeClass('disabled');
    } else {
      this.$el.find('.nav-tabs .track').addClass('disabled');
    }
  },

  addTrack: function () {
    this.track = new ShipTrackView({
      model: this.model
    });
    this.track.render();
    this.$el.find('#track').append(this.track.$el);
    this.trackTab();
  },

  updateTrack: function () {
    this.track.render();
    this.trackTab();
  },

  shipdataTab: function () {
    if (this.chkShipdata()) {
      this.$el.find('.nav-tabs .shipdetails').removeClass('disabled');
    } else {
      this.$el.find('.nav-tabs .shipdetails').addClass('disabled');
    }
  },

  addShipdata: function () {
    this.shipdata = new ShipDetailsView({
      model: this.model
    });
    this.shipdata.render();
    this.$el.find('#shipdetails').append(this.shipdata.$el);
    this.shipdataTab();
  },

  updateShipdata: function () {
    this.shipdata.render(this.model);
    this.shipdataTab();
  },

  positionTab: function () {
    if (this.model.has('position')) {
      this.$el.find('.nav-tabs .lastposition').removeClass('disabled');
    } else {
      this.$el.find('.nav-tabs .lastposition').addClass('disabled');
    }
  },

  addPosition: function () {
    this.position = new ShipPositionView({
      model: this.model
    });
    this.position.render();
    this.$el.find('#lastposition').append(this.position.$el);
    this.positionTab();
  },

  updatePosition: function () {
    this.position.render(this.model);
    this.positionTab();
  },

  chkShipdata: function () {
    if (!this.model.has('shipdata') || _.isEmpty(this.model.get('shipdata').attributes)) {
      return false;
    }

    return true;
  },

  render: function () {
    this.$el.html(this.template({
      title: this.model.getHelper().toTitel(),
      active: {
        ship: this.chkShipdata(),
        position: !this.chkShipdata()
      }
    }));

    this.addShipdata();
    this.addPosition();
    this.addTrack();

    this.listenTo(this.model, 'change:shipdata', this.updateShipdata);
    this.listenTo(this.model, 'change:position', this.updatePosition);
    this.listenToOnce(this.model.get('track'), "sync", function () {
      this.updateTrack();
      this.listenTo(this.model.get('track'), "remove", this.updateTrack);
      this.listenTo(this.model.get('track'), "add", this.updateTrack);
      this.listenTo(this.model, 'change:position', this.updateTrack);
    }, this);
  }
});

module.exports = ShipView;
