var Backbone = require('backbone');

var Shipdatum = Backbone.RelationalModel.extend({
  url: '/api/shipdata',
  parse: function (data, xhr) {
    data.raw = data.raw && JSON.parse(data.raw) || data.raw;
    return Backbone.RelationalModel.prototype.parse.call(this, data, xhr);
  }
});

module.exports = Shipdatum;
