"use strict";

var $ = require('jquery');

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

var Desktop = require('./lib/desktop');

var desktop = new Desktop();
desktop.run();

window.desktop = desktop;