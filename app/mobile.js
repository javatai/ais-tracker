"use strict";

var Mobile = require('./lib/mobile');
var mobile = new Mobile();

document.addEventListener("deviceready", mobile.run, false);
