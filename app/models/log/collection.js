'use strict';

var Backbone = require('backbone');
var LogItem = require('./model');

var LogCollection = Backbone.Collection.extend({
  model: LogItem,
  initialize: function () {
    this.listenTo(this, 'add', this.cleanup);
  },
  cleanup: function () {
    if (this.length > 99) {
      this.remove(this.shift());
    }
  }
});

var logCollection = new LogCollection();
window.logCollection = logCollection;
module.exports = logCollection;
