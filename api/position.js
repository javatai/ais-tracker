"use strict";

var Position = require('../models/position');

module.exports = function (server, epilogue) {

  epilogue.resource({
    model: Position,
    endpoints: ['/api/positions', '/api/position/:id'],
    search: {
      param: 'datetime__greater_than',
      operator: '$gt',
      attributes: [ 'datetime' ]
    },
    actions: [ 'list', 'read' ]
  });

}
