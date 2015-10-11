var $ = require('jquery');
var bootstrap = require('bootstrap');
var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;

var App = require('./lib/app');
var app = new App();
app.run();
