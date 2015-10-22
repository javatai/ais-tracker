'use strict';

var Platform = require('./platform');
var Backbone = require('backbone');

var View = Backbone.View.extend({
  delegateEvents: function(events) {
    var key, newKey, oldValue;
    this.events = this.events || events;
    for (key in this.events) {
      if (key.indexOf('fastclick') === 0) {
        if (Platform.isTouchDevice) {
          newKey = key.replace('fastclick', 'touchend');
        } else {
          newKey = key.replace('fastclick', 'click');
        }
        oldValue = this.events[key];
        this.events[newKey] = oldValue;
        delete this.events[key];
      }
    }
    return Backbone.View.prototype.delegateEvents.call(this, this.events);
  }
});

module.exports = View;
