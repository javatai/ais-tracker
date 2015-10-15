'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var bganimate = require('../lib/background-animate');

var template = require('./log-item.hbs');

var LogItemView = Backbone.View.extend({
  tagName: 'tr',
  template: template,

  className: function () {
    var cls = '';
    if (this.model.has('userid')) {
      cls = this.model.get('userid') + ' ';
    }
    return cls + 'list-item ' + this.model.get('type')
  },

  initialize: function (options) {
    this.listenTo(this.model, 'remove', this.remove);
  },

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
  }
});

module.exports = LogItemView;
