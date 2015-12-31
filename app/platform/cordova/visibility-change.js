'use strict';

module.exports = function (platform) {
  document.addEventListener("pause", function () {
    platform.trigger("hidden");
  }, false);

  document.addEventListener("resume", function () {
    platform.trigger("visible");
  }, false);
}
