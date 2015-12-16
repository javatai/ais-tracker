'use strict';

var $ = require('jquery');
var _ = require('underscore');

var ListHeaderView = require('./list-header');
var ListItemView = require('./list-item');

var View = require('../lib/view');
var template = require('./list-view.hbs');

var ListView = View.extend({
  tagName: 'div',
  className: 'item listview',
  listItems: {},
  container: null,
  template: template,

  initialize: function () {
    this.isShown = false;
    this.search = '';
    this.render();

    this.listenTo(this.collection, 'add', this.addItemView);
    this.listenTo(this.collection, 'remove', this.removeItemView);

    this.listenToOnce(this.collection, 'sync:socket', this.initItems);
  },

  unsetFilter: function () {
    this.search = '';
    _.invoke(this.listItems, 'filter');
  },

  filter: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    var search = $(evt.target).val();
    this.search = search && search.toLowerCase() || '';

    _.invoke(this.listItems, 'filter');
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

    this.listItems[ship.id] = listItem;

    this.renderItem(ship);
  },

  removeItemView: function (ship) {
    if (!this.listItems[ship.id]) return;

    this.listItems[ship.id].remove();
    delete this.listItems[ship.id];
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

    this.$el.delegate('.dropdown', 'show.bs.dropdown', _.bind(this.dropdownShow, this));
    this.$el.delegate('.dropdown', 'hide.bs.dropdown', _.bind(this.dropdownHide, this));

    this.listenTo(this.listHeaderView, 'hide.bs.dropdown', this.dropdownHide);
  },

  hideing: false,
  dropdownShow: function () {
    if (this.hideing) return;
    this.$el.find('.mask').show();
  },

  dropdownHide: function () {
    this.hideing = true;
    _.delay(_.bind(function () {
      this.$el.find('.mask').hide();
      this.hideing = false;
    }, this), 250);
  },

  initItems: function () {
    this.listenTo(this.collection, 'sort', this.renderItems);
    this.collection.sort();
  },

  renderItem: function (ship) {
    var index = this.collection.indexOf(ship);
    var id = ship.id;
    var before = this.container.children().eq(index-1);
    if (before.length > 0) {
      this.listItems[id].after(before);
    } else {
      this.listItems[id].prepend();
    }
  },

  renderItems: function () {
    var ids = this.collection.pluck('id');
    ids.reverse();
    _.each(ids, function (id) {
      if (this.listItems[id])
        this.listItems[id].prepend();
    }, this);
  }
});

module.exports = ListView;
