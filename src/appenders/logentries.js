'use strict';

var logUtils = require('../log-utils.js'),
  le = require('le_js'),
  logLevels = require('../log-level.js'),
  logEmitter = require('../log-emitter.js');

function handler(logEvent) {
  try {
    var logFunc = le[logLevels[logEvent.level].name];

    if (logUtils.isFunction(logFunc)) {
      logFunc(logEvent);
    }
  } catch (ex) {
    // do nothing
  }
}

function LogEntriesAppender(token) {
  if (!logUtils.isString(token) || !token) {
    return;
  }
  le.init(token);
  logEmitter.listen(handler);
}

module.exports = LogEntriesAppender;