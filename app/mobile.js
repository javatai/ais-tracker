"use strict";

var Mobile = require('./lib/mobile');
var mobile = new Mobile();

if (typeof(cordova) !== 'undefined') {
  document.addEventListener("deviceready", function () {
    mobile.run();
  });
} else {
  mobile.run();
}
