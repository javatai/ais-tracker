'use strict';

var _ = require('underscore');
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
  },

  reset: function(models, options) {
    models  || (models = []);
    options || (options = {});

    for (var i = 0, l = this.models.length; i < l; i++) {
      this._removeReference(this.models[i]);

      this.trigger('remove', this.models[i], this);
      this.models[i].trigger('remove', this.models[i], this);
    }

    this._reset();
    this.add(models, _.extend({silent: true}, options));

    if (!options.silent) this.trigger('reset', this, options);
    return this;
  }
});

var logCollection = new LogCollection();
window.logCollection = logCollection;
module.exports = logCollection;
