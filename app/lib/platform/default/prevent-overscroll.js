"use strict";

var $ = require('jquery');

module.exports = function () {
  var selScrollable = '.scrollable';
  $(document).on('touchmove',function(e){
    e.preventDefault();
  });

  $('body').on('touchstart', selScrollable, function(e) {
    if (e.currentTarget.scrollTop === 0) {
      e.currentTarget.scrollTop = 1;
    } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
      e.currentTarget.scrollTop -= 1;
    }
  });

  $('body').on('touchmove', selScrollable, function(e) {
    e.stopPropagation();
  });
}
