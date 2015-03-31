'use strict';

var util = require('util'),
  logUtils = require('../log-utils.js'),
  le = require('../../vendors/le.js'),
  logLevels = require('../log-level.js'),
  Appender = require('./appender.js');

function handler(nativeLogger) {
  return function(logEvent) {
    try {
      var logFunc = nativeLogger[logLevels[logEvent.level].name];

      if (logUtils.isFunction(logFunc)) {
        logFunc(logEvent);
      }
    } catch (ex) {
      // do nothing
    }
  };
}

function LogEntriesAppender(token) {
  var leLogger;

  if (!logUtils.isString(token) || !token) {
    return;
  }

  this.token = token;
  leLogger = le.init({
    name: this.token,
    token: this.token
  });

  Appender.call(this, handler(leLogger));
}

util.inherits(LogEntriesAppender, Appender);

LogEntriesAppender.prototype.destroy = function() {
  LogEntriesAppender.super_.prototype.destroy.apply(this, arguments);
  le.destroy(this.token);
};

module.exports = LogEntriesAppender;