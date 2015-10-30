'use strict';

var $ = require('jquery');
var _ = require('underscore');

var ShipView = require('./ship-view');
var ListView = require('./list-view');
var AboutView = require('./about-view');
var LogView = require('./log-view');

var View = require('../lib/view');
var template = require('./desktop-view.hbs');

var BaseView = View.extend({
  template: template,

  closeview: _.noop,
  openview: _.noop,

  onStart: function () {
    this.listenTo(this.collection, 'remove', this.chkShipview);
  },

  onStop: function () {
    this.$el.find("input[type='text']").val('');
    this.listView.unsetFilter();

    this.stopListening(this.collection, 'remove', this.chkShipview);
  },

  chkShipview: function (ship) {
    if (this.shipview && this.shipview.model.get('id') === ship.get('id')) {
      if (this.isOpen) {
        this.openlistview();
      }
      this.destroyShipview();
    }
    this.updateFooter();
  },

  findCarouselIndexByClass: function (name) {
    var number = 0;
    this.$el.find('.item').each(function(index) {
      if ($(this).hasClass(name)) {
        number = index;
      }
    });
    return number;
  },

  updateFooter: function (name) {
    if (this.shipview) {
      this.$el.find('.footer li.toship').removeClass('disabled');
    } else {
      this.$el.find('.footer li.toship').addClass('disabled');
    }

    this.$el.find('.footer li').each(function () {
      if (name && $(this).hasClass(name)) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
  },

  openviewhelper: function (cls, cntr) {
    if (!this.$el.find('.item.active').length) {
      this.$el.find('.item.'+cls).addClass('active');
    }

    var number = this.findCarouselIndexByClass(cls);
    this.$el.find('.carousel').carousel(number);
    this.openview();

    if (cls === 'listview') {
      this.logView.isShown = false;
      this.listView.isShown = true;
    } else if (cls === 'logview') {
      this.logView.isShown = true;
      this.listView.isShown = false;
    } else {
      this.logView.isShown = false;
      this.listView.isShown = false;
    }

    this.updateFooter(cntr);
  },

  openlistview: function () {
    this.openviewhelper('listview', 'tolist');
  },

  openshipview: function () {
    if (!this.shipview) return;

    this.openviewhelper('shipview', 'toship');
  },

  openaboutview: function () {
    this.openviewhelper('aboutview', 'toabout');
  },

  openlogview: function () {
    this.openviewhelper('logview', 'tolog');
  },

  filter: function (evt) {
    this.listView.filter(evt);
  },

  selectShip: function (ship, selected) {
    if (selected) {
      this.destroyShipview();

      this.shipview = new ShipView({
        model: ship
      });

      this.shipview.render();

      this.$el.find('.carousel-inner').append(this.shipview.$el);

      this.openview();

      if (!this.$el.find('.item.active').length) {
        this.$el.find('.item.shipview').addClass('active');
      } else {
        var number = this.findCarouselIndexByClass('shipview');
        this.$el.find('.carousel').carousel(number);
      }

      this.logView.isShown = false;
      this.listView.isShown = false;
      this.updateFooter('toship');
    }
  },

  modal: function (url) {
    var $f = $('<iframe></iframe>');
    $f.attr('src', url);

    $f.attr('frameborder', 0);
    $f.attr('width', '100%');
    $f.attr('height', '100%');

    $('.modal .modal-content').append($f);
    $('.modal').modal('show');
  },

  render: function () {
    this.$el.html(this.template());
    this.$el.find('.carousel').carousel({
      interval: false,
      pause: false
    });

    this.listView = new ListView({
      collection: this.collection,
    });
    this.$el.find('.carousel-inner').append(this.listView.$el);

    this.logView = new LogView();
    this.$el.find('.carousel-inner').append(this.logView.$el);

    this.aboutView = new AboutView({
      app: this.app,
      base: this
    });
    this.$el.find('.carousel-inner').append(this.aboutView.$el);

    this.listenTo(this.collection, 'change:selected', this.selectShip);

    var self = this;
    $('#map').delegate( "a", "click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!$(e.target).attr('href')) return;

      var isGoogle = $(e.target).attr('href').indexOf('google') > -1;
      var isTerms = $(e.target).attr('href').indexOf('term') > -1;

      if (isGoogle && !isTerms) {
        window.open($(e.target).attr('href'), "_system");
        return;
      }

      self.modal($(e.target).attr('href'));
    });

    $('.modal').on('hidden.bs.modal', function () {
      $('.modal .modal-content').empty();
    });
  },

  destroyShipview: function () {
    if (this.shipview) {
      this.shipview.remove();
      delete this.shipview;
    }
    if (this.isOpen) {
      this.openlistview();
    }
    this.updateFooter();
  }
});

module.exports = BaseView;
