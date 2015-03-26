'use strict';

var logUtils = require('../log-utils.js'),
  logLevels = require('../log-level.js'),
  logEmitter = require('../log-emitter.js');

function handler(logEvent) {
  try {
    var logMessage = (logUtils.isObject(logEvent.message)) ? JSON.stringify(logEvent.message) : logEvent.message;
    window.console[logLevels[logEvent.level].name](
      '[%s | %s] %s: %s',
      new Date(logEvent.timestamp),
      logEvent.level,
      logEvent.category,
      logMessage);
  } catch (ex) {
    // do nothing
  }
}

function ConsoleAppender() {
  if (!window.console) {
    return;
  }

  logEmitter.listen(handler);
}

module.exports = ConsoleAppender;