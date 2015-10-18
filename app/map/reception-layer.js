'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var moment = require('moment');
var MapGL = require('./map');

var colors = {
  'today': "rgba(255,0,0,0.4)",
  'thisweek': "rgba(0,222,0,0.3)",
  'lastweek': "rgba(0,0,255, 0.2)"
}

var ReceptionLayer = function (options) {
  this.app = options.app;
  this.layer = { };
  this.requests = { };

  this.mapgl = MapGL;

  this.listenTo(this.app, 'reception:layer', this.process);
};

_.extend(ReceptionLayer.prototype, Backbone.Events, {
  process: function (options) {
    this.removeFromMap(options.name);

    if (this.requests[name]) {
      this.requests[name].abort()
    }

    if (options.state === false) return;

    var data = { };
    if (options.name === 'thisweek' || options.name === 'lastweek') {
      data = {
        'datetime__greater_than': null,
        'datetime__lesser_than': null
      }

      var today = moment().utc();
      today.utc().startOf('day');

      if (options.name === 'lastweek') {
        today.utc().subtract(7, 'days');
      }

      today.utc().startOf('week');
      data.datetime__greater_than = today.utc().format();

      today.utc().endOf("week");
      data.datetime__lesser_than = today.utc().format();
    }

    this.requests[name] = $.getJSON('/api/reception', data, _.bind(function (geojson, success) {
      if (!success) {
        this.app.trigger('reception:failed', { name: name });
        return;
      }
      this.scope.addToMap(this.name, geojson);
    }, { name: options.name, scope: this }));
  },

  addSource: function (name, data) {
    this.mapgl.addSource(name, {
      "type": "geojson",
      "data": data
    });
  },

  addLayer: function (name) {
    var layer = {
      "id": name,
      "type": "fill",
      "source": name,
      "paint": {
        "fill-color": colors[name],
        "fill-outline-color": "rgba(0,0,0,0)"
      }
    }

    this.mapgl.addLayer(layer, 'markers');

    this.layer[name] = true;
  },

  addToMap: function (name, data) {
    this.requests[name] = false;

    this.addSource(name, data);
    this.addLayer(name);
  },

  removeFromMap: function (name) {
    if (this.layer[name]) {
      this.mapgl.removeLayer(name);
      this.layer[name] = false;
    }
    if (this.mapgl.getSource(name)) {
      this.mapgl.removeSource(name);
    }
  }
});

module.exports = ReceptionLayer;
