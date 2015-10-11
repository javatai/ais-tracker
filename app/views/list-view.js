var _ = require('underscore');
window._ = _;
var $ = require('jquery');
var Backbone = require('backbone');

var template = require('./list-view.hbs');

var ListHeaderView = require('./list-header');
var ListItemView = require('./list-item');

var ListView = Backbone.View.extend({
  tagName: 'div',
  className: 'item active',
  listItems: {},
  container: null,
  template: template,

  initialize: function () {
    this.search = '';
  },

  execFilter: function () {
    var hide = [];
    if (this.search.length > 0) {
      var found = this.collection.filter(function (ship) {
        var name = ship.has('shipdata') && ship.get('shipdata').get('name').toLowerCase() || '';
        var mmsi = ship.get('userid');

        if (name.indexOf(this.search) > -1 || String(mmsi).indexOf(this.search, 0) === 0) {
          return false;
        }
        return true;
      }, this);

      hide = _.map(found, function (ship) {
        return ship.get('id');
      });
    }

    _.each(this.listItems, function (item, id) {
      if (hide.indexOf(parseInt(id)) > -1) {
        item.hide();
      } else {
        item.show();
      }
    });
  },

  filter: function (evt) {
    var search = $(evt.target).val();
    this.search = search && search.toLowerCase() || '';
    this.execFilter();
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

    _.invoke(this.listItems, 'updateIndex');

    listItem.render();

    this.listItems[ship.get('id')] = listItem;

//    console.log('add', this.listItems[ship.get('id')].index, ship.toTitel());
  },

  removeItemView: function (ship) {
    this.listItems[ship.get('id')].remove();

//    console.log('remove', this.listItems[ship.get('id')].index, ship.toTitel());

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
      _.invoke(this.listItems, 'update');
    });

    this.container = this.$el.find('tbody');

    this.listenTo(this.collection, 'add', this.addItemView);
    this.listenTo(this.collection, 'remove', this.removeItemView);

    this.execFilter();

    window.listItems = this.listItems;
  }
});

module.exports = ListView;
