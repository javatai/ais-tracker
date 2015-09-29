"use strict";

var ShipData = require('../models/shipdata');

module.exports = function (server, epilogue) {

  epilogue.resource({
    model: ShipData,
    endpoints: ['/api/shipdata', '/api/shipdata/:id'],
    actions: [ 'list', 'read' ]
  });

}
