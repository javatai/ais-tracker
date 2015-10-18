var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var template = require('./about-view.hbs');

var AboutView = Backbone.View.extend({
  tagName: 'div',
  className: 'item aboutview',
  template: template,

  events: {
    "switchChange.bootstrapSwitch input[type='checkbox']": 'changereceptionlayer'
  },

  initialize: function (options) {
    this.app = options.app;

    this.render();
  },

  changereceptionlayer: function (evt, state) {
    this.app.trigger('reception:layer', { name: $(evt.target).attr('id'), state: state });
  },

  onFailure: function (name) {
    $('#' + name).bootstrapSwitch('state', false);
  },

  render: function () {
    this.$el.html(this.template({ }));
    this.$el.find("input[type='checkbox']").bootstrapSwitch();

    this.listenTo(this.app, 'reception:failed', this.onFailure);
  }
});

module.exports = AboutView;
