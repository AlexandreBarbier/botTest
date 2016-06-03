/**
 * Koa config
 */

'use strict';

var config = require('./environment');
var morgan = require('koa-morgan');
var bodyParser = require('koa-bodyparser');

module.exports = function(app) {
    
   // Logger 
   app.use(morgan.middleware(config.logType));
   app.use(bodyParser());
};