'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var AisMessage = Backbone.Collection.extend({
  fromJSON: function (fields) {
    _.each(fields, function (field) {
      field.name = field.name.toLowerCase();
      this.add(field);
    }, this);
  },
  lookup: function (name, value) {
    var field = this.findWhere({ name: name });
    if (!field) {
      return value;
    }
    var lookuptable = field.get('lookuptable');
    var lookup = _.findWhere(lookuptable, { value: value });
    return lookup && lookup.desc || value;
  }
});

module.exports = AisMessage;