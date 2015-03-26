'use strict';

var logUtils = require('./log-utils.js'),
  logLevels = require('./log-level.js'),
  config = require('./config.js'),
  Logger = require('./logger.js'),
  ConsoleAppender = require('./appenders/console.js'),
  LogentriesAppender = require('./appenders/logentries.js'),
  CustomAppender = require('./appenders/custom.js');

//
//logUtils.transform(logLevels, function(result, n, key) {
//  result[key] = key;
//});

var levelEnums = {},
  loggers = {},
  logAppenders = {},
  FindlyLog = {};

function createConsoleAppender() {
  var consoleAppender = new ConsoleAppender();
  if (consoleAppender) {
    logAppenders.console = consoleAppender;
  }
}

function validateAppender(name) {
  if (!logUtils.isString(name) || !name || name === 'console') {
    throw new Error('Invalid appender name.');
  }

  if (logAppenders.hasOwnProperty(name)) {
    throw new Error('There is an existing appender with the same name.');
  }
}

FindlyLog.logLevel = function(level) {
  if (arguments.length === 0) {
    return config.level();
  } else if (levelEnums.hasOwnProperty(level)) {
    config.level(level);
  }
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
  validateAppender(name, handler);

  if (!logUtils.isFunction(handler)) {
    throw new Error('Invalid handler function.');
  }

  logAppenders[name] = new CustomAppender(handler);
};

FindlyLog.addLogEntriesAppender = function(token) {
  validateAppender(token);
  logAppenders[token] = new LogentriesAppender(token);
};

FindlyLog.removeAppender = function(name) {
  if (logAppenders.hasOwnProperty(name)) {
    delete logAppenders[name];
  }
};

levelEnums = logUtils.reduce(logLevels, {}, function(result, key) {
  result[key] = key;
  return result;
});

FindlyLog.levels = levelEnums;

// by default, we attempt to create console appender
createConsoleAppender();

module.exports = FindlyLog;