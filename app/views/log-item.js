'use strict';

var bganimate = require('../lib/helper/background-animate');

var View = require('../lib/view');
var template = require('./log-item.hbs');

var LogItemView = View.extend({
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
