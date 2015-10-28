'use strict';

var $ = require('jquery');

module.exports = function (platform) {
  if (device.platform === 'iOS' && Number(device.version.substr(0,1)) >= 7) {
    $('html').addClass('ios7');
  }
}
