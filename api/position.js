"use strict";

var Position = require('../models/position');

module.exports = function (server, epilogue) {
  epilogue.resource({
    model: Position,
    endpoints: ['/api/positions', '/api/position/:id'],
    actions: [ 'list', 'read' ]
  });
}
