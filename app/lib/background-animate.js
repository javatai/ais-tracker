'use strict';

var _ = require('underscore');

module.exports = function ($el) {
  $el.animate({
    backgroundColor: "#d9edf7"
  }, {
    duration: 500,
    complete: function() {
      _.delay(_.bind(function () {
        $(this).animate({
          backgroundColor: "#fffff"
        }, {
          duration: 500,
          complete: function() {
            $(this).removeAttr('style');
          }
        });
      }, this), 500);
    }
  });
}