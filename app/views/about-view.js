var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var template = require('./about-view.hbs');

var AboutView = Backbone.View.extend({
  tagName: 'div',
  className: 'item aboutview',
  template: template,

  initialize: function () {
    this.render();
  },

  render: function () {
    this.$el.html(this.template({ }));
  }
});

module.exports = AboutView;
