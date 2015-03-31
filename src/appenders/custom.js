'use strict';

var util = require('util'),
  logUtils = require('../log-utils.js'),
  Appender = require('./appender.js');

function CustomAppender(handler) {
  if (!logUtils.isFunction(handler)) {
    return;
  }
  Appender.call(this, handler);
}

util.inherits(CustomAppender, Appender);

module.exports = CustomAppender;