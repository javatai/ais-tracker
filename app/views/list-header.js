var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var moment = require('moment');

var template = require('./list-header.hbs');

var ListHeader = Backbone.View.extend({
  template: template,

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
    "click .column_change" : "change"
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

    this.trigger('column:change', this.selectedColumn());
    this.render();
  },

  selectedColumn: function () {
    return _.findWhere(this.column, { selected: true });
  },

  render: function () {
    var selected = this.selectedColumn();
    var other = _.findWhere(this.column, { selected: false });

    this.$el.html(this.template({
      filter: this.search,
      secondColumn: selected.label,
      changelabel: other.changelabel,
    }));
  }
});

module.exports = ListHeader;
