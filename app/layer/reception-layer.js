'use strict';

var config = require('../config').server;

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var moment = require('moment');
var Map = require('../map/map');

var colors = {
  'today': "rgba(255,0,0,0.4)",
  'thisweek': "rgba(0,222,0,0.3)",
  'lastweek': "rgba(0,0,255, 0.2)"
}

var ReceptionLayer = function (options) {
  this.app = options.app;
  this.layer = { };
  this.requests = { };

  this.listenTo(this.app, 'reception:layer', this.process);
};

_.extend(ReceptionLayer.prototype, Backbone.Events, {
  process: function (options) {
    this.removeFromMap(options.name);

    if (this.requests[options.name]) {
      this.requests[options.name].abort()
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

    var url = '';
    if (typeof(cordova) !== 'undefined' || location.protocol === 'https:') {
      url = 'https://' + config.hostname + ':' + config.https + '/api/reception';
    } else {
      url = 'http://' + config.hostname + ':' + config.http + '/api/reception';
    }

    this.requests[options.name] = $.getJSON(url, data, _.bind(function (geojson, success) {
      if (!success) {
        this.app.trigger('reception:failed', { name: name });
        return;
      }
      this.scope.addToMap(this.name, geojson);
    }, { name: options.name, scope: this }));
  },

  addToMap: function (name, data) {
    Map.addToMap({
      name: 'reception-' + name,
      data: data,
      layer: [{
        name:'reception-' + name,
        behind: 'markers',
        json: {
          "type": "fill",
          "paint": {
            "fill-color": colors[name],
            "fill-outline-color": "rgba(0,0,0,0)"
          }
        }
      }]
    });
  },

  removeFromMap: function (name) {
    Map.removeFromMap({
      name: 'reception-' + name,
      layer: [ 'reception-' + name ]
    });
  }
});

module.exports = ReceptionLayer;
