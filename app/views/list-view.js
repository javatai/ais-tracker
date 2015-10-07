var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var moment = require('moment');
var template = require('./list-view.hbs');

var ListView = Backbone.View.extend({
  template: template,
  search: '',

  column: [{
    label: 'MMSI',
    getter: 'userid',
    initsort: 'asc',
    changelabel: 'Switch to MMSI',
    selected: true
  }, {
    label: 'Datetime',
    changelabel: 'Switch to last position datetime',
    getter: 'datetime',
    initsort: 'desc',
    selected: false,
    format: function (datetime) {
      return moment.utc(datetime).format("YYYY-MM-DD HH:mm:ss UTC");
    }
  }],

  events: {
    "click .name_asc" : "sortnameasc",
    "click .name_desc" : "sortnamedesc",
    "click .column_asc" : "sortcolumnasc",
    "click .column_desc" : "sortcolumndesc",
    "click .column_change" : "change",
    "click tbody tr" : "select"
  },

  initialize: function (options) {
    this.listenTo(this.collection, "sync", this.render);
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

    this.collection.each(function (ship) {
      var id = ship.get('id');
      if (hide.indexOf(id) > -1) {
        this.$el.find('#' + id).hide();
      } else {
        this.$el.find('#' + id).show();
      }
    }, this);
  },

  filter: function (evt) {
    var search = $(evt.target).val();
    this.search = search && search.toLowerCase() || '';
    this.execFilter();
  },

  sortnameasc: function () {
    this.collection.changeSort("name", "asc");
    this.render();
  },

  sortnamedesc: function () {
    this.collection.changeSort("name", "desc");
    this.render();
  },

  sortcolumnasc: function () {
    this.collection.changeSort(_.findWhere(this.column, { selected: true }).getter, "asc");
    this.render();
  },

  sortcolumndesc: function () {
    this.collection.changeSort(_.findWhere(this.column, { selected: true }).getter, "desc");
    this.render();
  },

  change: function (evt) {
    _.each(this.column, function (item, index) {
      this.column[index].selected = !this.column[index].selected;

      if (this.column[index].selected) {
        this.collection.changeSort(this.column[index].getter, this.column[index].initsort);
        this.collection.sort();
      }
    }, this);

    this.render();
  },

  select: function (evt) {
    var id = $(evt.currentTarget).attr('id');
    this.trigger('select', this.collection.get(id));
  },

  render: function () {
    var selected = _.findWhere(this.column, { selected: true });
    var other = _.findWhere(this.column, { selected: false });

    var ships = this.collection.map(function (ship) {
      return {
        id: ship.get('id'),
        name: ship.getHelper().toTitel(),
        value: selected.format && selected.format(ship.get(selected.getter)) || ship.get(selected.getter)
      }
    });

    this.$el.html(this.template({
      filter: this.search,
      ships: ships,
      secondColumn: selected.label,
      changelabel: other.changelabel
    }));

    this.execFilter();
  }
});

module.exports = ListView;
