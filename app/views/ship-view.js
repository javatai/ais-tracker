'use strict';

var _ = require('underscore');

var ShipDetailsView = require('./ship-details');
var ShipPositionView = require('./ship-position');
var ShipTrackView = require('./ship-track');

var View = require('../lib/view');
var template = require('./ship-view.hbs');

var ShipView = View.extend({
  tagName: 'div',
  className: 'item shipview',
  template: template,

  events: {
    "fastclick h3": "center",
    "fastclick a[href='#shipdetails']": "chkShipdata",
    "fastclick a[href='#lastposition']": "chkPosition",
    "fastclick a[href='#track']": "chkTrack"
  },

  center: function () {
    this.model.getMarker().center();
  },

  chkShipdata: function (e) {
    if (!this.hasShipdata()) {
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
    this.trackTab();
  },

  shipdataTab: function () {
    if (this.hasShipdata()) {
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

  hasShipdata: function () {
    if (!this.model.has('shipdata') || _.isEmpty(this.model.get('shipdata').attributes)) {
      return false;
    }
    return true;
  },

  render: function () {
    this.$el.html(this.template({
      title: this.model.getHelper().toTitle(),
      active: {
        ship: this.hasShipdata(),
        position: !this.hasShipdata()
      }
    }));

    this.addShipdata();
    this.addPosition();
    this.addTrack();

    this.listenTo(this.model.get('shipdata'), 'change', this.updateShipdata);
    this.listenTo(this.model.get('position'), 'change', this.updatePosition);

    this.listenToOnce(this.model.get('track'), "sync", function () {
      this.updateTrack();
      this.listenTo(this.model.get('track'), "remove", this.updateTrack);
      this.listenTo(this.model.get('track'), "add", this.updateTrack);
    }, this);
  },

  remove: function () {
    this.shipdata.remove();
    this.position.remove();
    this.track.remove();

    View.prototype.remove.call(this);
  }
});

module.exports = ShipView;
