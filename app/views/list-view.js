var _ = require('underscore');
window._ = _;
var $ = require('jquery');
var Backbone = require('backbone');

var template = require('./list-view.hbs');

var ListHeaderView = require('./list-header');
var ListItemView = require('./list-item');

var ListView = Backbone.View.extend({
  tagName: 'div',
  className: 'item listview',
  listItems: {},
  container: null,
  template: template,

  initialize: function () {
    this.search = '';
    this.render();

    this.listenTo(this.collection, 'add', this.addItemView);
    this.listenTo(this.collection, 'remove', this.removeItemView);
    this.listenToOnce(this.collection, 'sync', this.initItems);
  },

  filter: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    var search = $(evt.target).val();
    this.search = search && search.toLowerCase() || '';

    this.container.empty();
    this.renderItems();
  },

  getContainer: function () {
    return this.container;
  },

  addItemView: function (ship) {
    var listItem = new ListItemView({
      model: ship,
      collection: this.collection,
      listview: this
    });

    listItem.render();

    this.listItems[ship.get('id')] = listItem;
  },

  removeItemView: function (ship) {
    this.listItems[ship.get('id')].remove();
    delete this.listItems[ship.get('id')];
  },

  render: function () {
    this.$el.html(this.template({ }));

    this.listHeaderView = new ListHeaderView({
      el: this.$el.find('thead'),
      collection: this.collection
    });

    this.selectedColumn = this.listHeaderView.selectedColumn();
    this.listHeaderView.render();

    this.listenTo(this.listHeaderView, 'column:change', function (selectedColumn) {
      this.selectedColumn = selectedColumn;
      _.invoke(this.listItems, 'render');
    });

    this.container = this.$el.find('tbody');
  },

  initItems: function () {
    this.renderItems();
    this.listenTo(this.collection, 'sort', this.renderItems);
    this.listenTo(this.collection, 'add', this.renderItems);
    this.listenTo(this.collection, 'remove', this.renderItems);
  },

  renderItems: function () {
    var ids = this.collection.pluck('id');
    ids.reverse();
    _.each(ids, function (id) {
      this.listItems[id].prepend();
    }, this);
  }
});

module.exports = ListView;
