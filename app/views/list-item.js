var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var template = require('./list-item.hbs');

var ListItem = Backbone.View.extend({
  tagName: 'tr',
  template: template,

  events: {
    "click *" : "select"
  },

  attributes: function () {
    return {
      id: 'ship-item-' + this.model.get('id')
    }
  },

  select: function () {
    this.collection.selectShip(this.model);
  },

  initialize: function (options) {
    this.index = 0;

    this.listview = options.listview;
    this.updateIndex();

    this.listenTo(this.collection, 'sort', function () {
      this.index = this.collection.indexOf(this.model);
      this.insert();
    }, this);
  },

  updateIndex: function () {
    this.index = this.collection.indexOf(this.model);
  },

  insert: function () {
    var before = null, after = null;
    _.each(this.listview.listItems, function (item) {
      if (item.index < this.index && (!before || before.index < item.index)) {
        before = item;
      }
      if (item.index > this.index && (!after || after.index > item.index)) {
        after = item;
      }
    }, this);

// console.log('-------------');
// console.log(before && before.model.getHelper().toTitel());
// console.log(this.model.getHelper().toTitel());
// console.log(after && after.model.getHelper().toTitel());

    if (before) {
      this.$el.insertAfter(before.$el);
    } else if (after) {
      this.$el.insertBefore(after.$el);
    } else {
      this.listview.getContainer().append(this.$el);
    }
  },

  show: function () {
    this.$el.show();
  },

  hide: function () {
    this.$el.hide();
  },

  update: function () {
    var s = this.listview.selectedColumn;

    this.$el.html(this.template({
      index: (this.index + 1),
      name: this.model.getHelper().toTitel(),
      value: s.format && s.format(this.model.get(s.getter)) || this.model.get(s.getter)
    }));

    this.updateClass();
  },

  updateClass: function () {
    if (this.model.get('selected')) {
      this.$el.addClass('success');
    } else {
      this.$el.removeClass('success');
    }
  },

  render: function () {
    this.update();
    this.insert();
    this.listenTo(this.model, 'change:selected', this.updateClass);
  }
});

module.exports = ListItem;
