'use strict';

var _ = require('lodash'),
  internalLogger = require('../vendor/log4javascript.js'),
  logLevels = {
    TRACE: 'TRACE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    FATAL: 'FATAL',
    OFF: 'OFF'
  },
  config = {
    level: logLevels.INFO
  },
  ajaxAppenders = {},
  loggers = {};

function applyToAllLoggers(func) {
  _.forIn(loggers, func);
}

function logLevel(level) {
  if (arguments.length === 0) {
    return config.level;
  }

  if (logLevels.hasOwnProperty(level)) {
    config.level = level;
    applyToAllLoggers(function(logger) {
      logger.setLevel(internalLogger.Level[config.level]);
    });
  }
}

function createAjaxAppender(host) {
  var ajaxAppender = new internalLogger.AjaxAppender(host);
  ajaxAppender.setLayout(new internalLogger.JsonLayout());
  return ajaxAppender;
}

function createConsoleAppender() {
  var consoleAppender = new internalLogger.BrowserConsoleAppender(),
    format = '[%d{dd MMM yyyy HH:mm:ss} | %p] %c - %m{1}%n';
  consoleAppender.setLayout(new internalLogger.PatternLayout(format));
  return consoleAppender;
}

function getLogger(logName) {
  var logger;

  logName = _.isString(logName) ? logName : '';

  if (!_.isObject(loggers[logName])) {
    logger = internalLogger.getLogger(logName);

    logger.setLevel(internalLogger.Level[config.level]);

    // create console appender by default
    logger.addAppender(createConsoleAppender());

    //if we have some ajax appenders defined, attach them to the log
    _.forIn(ajaxAppenders, function(appender) {
      logger.addAppender(appender);
    });

    loggers[logName] = logger;
  }

  return loggers[logName];
}

function cleanUrl(url) {
  if (!_.isString(url) || !url) {
    return '';
  }
  return url.replace(/[^\w\s]/gi, '');
}

function addAppender(url) {
  var ajaxAppender,
    formattedUrl = cleanUrl(url);
  if (!formattedUrl || ajaxAppenders.hasOwnProperty(formattedUrl)) {
    return;
  }
  // create new appender
  ajaxAppender = createAjaxAppender(url);
  ajaxAppenders[formattedUrl] = ajaxAppender;
  // assign new appender to all existing loggers
  applyToAllLoggers(function(logger) {
    logger.addAppender(ajaxAppender);
  });
}

function removeAppender(url) {
  var formattedUrl = cleanUrl(url);
  if (!formattedUrl || !ajaxAppenders.hasOwnProperty(formattedUrl)) {
    return;
  }

  // remove existing appender from all loggers
  applyToAllLoggers(function(logger) {
    logger.removeAppender(ajaxAppenders[formattedUrl]);
  });

  // remove the appender
  delete ajaxAppenders[formattedUrl];
}

module.exports = {
  logLevels: logLevels,
  logLevel: logLevel,
  getLogger: getLogger,
  addAppender: addAppender,
  removeAppender: removeAppender
};