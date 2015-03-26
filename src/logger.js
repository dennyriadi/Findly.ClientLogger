'use strict';

var logUtils = require('./log-utils.js'),
  config = require('./config.js'),
  logLevels = require('./log-level.js'),
  LogEvent = require('./log-event.js'),
  logEmitter = require('./log-emitter.js');

function emitLog(level, name) {
  return function(message) {
    var logEvent,
      configLevel = config.level();
    if (logLevels[configLevel].index >= logLevels[level].index) {
      logEvent = new LogEvent(level, name, message);
      logEmitter.emit(logEvent);
    }
  };
}

function Logger(logName) {
  var self = this;

  if (!logUtils.isString(logName) || !logName) {
    throw new Error('Failed to create Logger, invalid logName: ' + logName);
  }

  logUtils.forEach(['debug', 'info', 'warn', 'error'], function(f) {
    self[f] = emitLog(f.toUpperCase(), logName);
  });
}

module.exports = Logger;