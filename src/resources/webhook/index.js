'use strict';

var controller = require('./webhook.controller');
var router = require('koa-router')();

router.get('/', controller.index);
router.post('/', controller.post);

module.exports = router.routes();