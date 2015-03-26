'use strict';

var logUtils = require('../log-utils.js'),
  logEmitter = require('../log-emitter.js');

function CustomAppender(handler) {
  if (!logUtils.isFunction(handler)) {
    return;
  }

  logEmitter.listen(handler);
}

module.exports = CustomAppender;