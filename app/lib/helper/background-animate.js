'use strict';

var $ = require('jquery');
var _ = require('underscore');

module.exports = function ($el) {
  $el.animate({
    backgroundColor: "#d9edf7"
  }, {
    duration: 500,
    complete: function() {
      $(this).animate({
        backgroundColor: "#fffff"
      }, {
        duration: 500,
        complete: function() {
          $(this).removeAttr('style');
        }
      });
    }
  });
}