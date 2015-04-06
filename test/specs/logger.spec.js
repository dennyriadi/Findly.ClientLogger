'use strict';

describe('logger', function() {
  var config = require('config'),
    logEmitter = require('log-emitter'),
    Logger = require('logger'),
    logger = new Logger('name');

  it('should throw if constructor is called with a non string logger name', function() {
    expect(function() {new Logger();}).toThrow();
    expect(function() {new Logger(null);}).toThrow();
    expect(function() {new Logger(1);}).toThrow();
    expect(function() {new Logger('');}).toThrow();
  });

  it('should have function called debug', function() {
    expect(typeof logger.debug).toBe('function');
  });

  it('should have function called info', function() {
    expect(typeof logger.info).toBe('function');
  });

  it('should have function called warn', function() {
    expect(typeof logger.warn).toBe('function');
  });

  it('should have function called error', function() {
    expect(typeof logger.error).toBe('function');
  });

  it('debug(), info(), warn(), error() should ONLY call logEmitter.emit() when current ' +
  'log level is set higher or equal', function() {
    spyOn(logEmitter, 'emit');
    config.level('WARN');

    logger.debug('DEBUG');
    logger.info('INFO');
    logger.warn('WARN');
    logger.warn('ERROR');

    expect(logEmitter.emit.calls.count()).toBe(2);
  });

});