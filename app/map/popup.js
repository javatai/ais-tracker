'use strict';

var _ = require('underscore');
var $ = require('jquery');

var _onClickClose = mapboxgl.Popup.prototype._onClickClose;

mapboxgl.Popup.prototype._onClickClose = function() {
  this.fire('remove', this);
  _onClickClose.apply(this, arguments);
}

mapboxgl.Popup.prototype.addClass = function (className) {
  if (!this.classNames) {
    this.classNames = [];
  }

  if (this.classNames.indexOf(className) < 0) {
    this.classNames.push(className);
  }

  return this;
}

var _update = mapboxgl.Popup.prototype._update;

mapboxgl.Popup.prototype._update = function () {
  var ret = _update.call(this);
  if (this._container) {
    var $_container = $(this._container);
    _.each(this.classNames, function (className) {
      if (!$_container.hasClass(className)) {
        $_container.addClass(className)
      }
    });
  }
  return ret;
}

module.exports = mapboxgl.Popup;
