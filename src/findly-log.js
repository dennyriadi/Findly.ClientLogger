'use strict';

var logUtils = require('./log-utils.js'),
  logLevels = require('./log-level.js'),
  config = require('./config.js'),
  Logger = require('./logger.js'),
  ConsoleAppender = require('./appenders/console.js'),
  LogentriesAppender = require('./appenders/logentries.js'),
  CustomAppender = require('./appenders/custom.js');

var levelEnums = {},
  loggers = {},
  logAppenders = {},
  reservedAppenderNames = ['console'],
  FindlyLog = {};

function createConsoleAppender() {
  var consoleAppender = new ConsoleAppender();
  if (consoleAppender) {
    logAppenders.console = consoleAppender;
  }
}

function isReservedAppenderName(name) {
  var result = false;
  name = name.toLowerCase();
  for (var i = 0; i < reservedAppenderNames.length; i++) {
    if (name === reservedAppenderNames[i]) {
      result = true;
      break;
    }
  }
  return result;
}

function validateAppender(name) {
  if (!logUtils.isString(name) || !name ) {
    throw new Error('Invalid appender name.');
  }

  if (isReservedAppenderName(name)) {
    throw new Error('Cannot use a reserved appender name.');
  }

  if (logAppenders.hasOwnProperty(name)) {
    throw new Error('There is an existing appender with the same name.');
  }
}

function removeAppender(name) {
  if (!isReservedAppenderName(name) && logAppenders.hasOwnProperty(name)) {
    logAppenders[name].destroy();
    delete logAppenders[name];
  }
}

levelEnums = logUtils.reduce(logLevels, {}, function(result, key) {
  result[key] = key;
  return result;
});

FindlyLog.logLevel = function(level) {
  var throwUnknownLevelError = function(lvl) {
    throw new Error('Unknown log level: ' + lvl);
  };

  if (arguments.length === 0) {
    return config.level();
  }

  if (!logUtils.isString(level)) {
    throwUnknownLevelError(level);
  }

  level = level.toUpperCase();
  if (!levelEnums.hasOwnProperty(level.toUpperCase())) {
    throwUnknownLevelError(level);
  }

  config.level(level);
};

FindlyLog.getLogger = function(logName) {
  if (!logUtils.isString(logName) || !logName) {
    return;
  }

  if (loggers.hasOwnProperty(logName)) {
    return loggers[logName];
  }

  loggers[logName] = new Logger(logName);
  return loggers[logName];
};

FindlyLog.addCustomAppender = function (name, handler) {
  validateAppender(name);
  if (!logUtils.isFunction(handler)) {
    throw new Error('Invalid handler function.');
  }

  logAppenders[name] = new CustomAppender(handler);
};

FindlyLog.removeCustomAppender = function(name) {
  removeAppender(name);
};

FindlyLog.addLogEntriesAppender = function(token) {
  validateAppender(token);
  logAppenders[token] = new LogentriesAppender(token);
};

FindlyLog.removeLogEntriesAppender = function(token) {
  removeAppender(token);
};

FindlyLog.levels = levelEnums;

// by default, we attempt to create console appender
createConsoleAppender();

module.exports = FindlyLog;