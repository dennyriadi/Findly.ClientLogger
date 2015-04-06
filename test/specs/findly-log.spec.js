'use strict';

describe('findly-log', function() {
  var findlyLog = require('findly-log'),
    config = require('config');

  describe('levels', function() {
    it('should have level called DEBUG', function() {
      expect(findlyLog.levels.hasOwnProperty('DEBUG')).toBeTruthy();
    });

    it('should have level called INFO', function() {
      expect(findlyLog.levels.hasOwnProperty('INFO')).toBeTruthy();
    });

    it('should have level called WARN', function() {
      expect(findlyLog.levels.hasOwnProperty('WARN')).toBeTruthy();
    });

    it('should have level called ERROR', function() {
      expect(findlyLog.levels.hasOwnProperty('ERROR')).toBeTruthy();
    });

    it('should have level called OFF', function() {
      expect(findlyLog.levels.hasOwnProperty('OFF')).toBeTruthy();
    });
  });

  describe('logLevel()', function() {
    it('should get log level when function is called without parameter', function() {
      var level = 'WARN';
      config.level(level);
      expect(findlyLog.logLevel()).toBe(level);
    });

    it('should not set log level other than debug, info, warn, error, off', function() {
      expect(function() { findlyLog.logLevel(null); }).toThrow();
      expect(function() { findlyLog.logLevel(1); }).toThrow();
      expect(function() { findlyLog.logLevel('level'); }).toThrow();
    });

    it('should set log level if level is "error"', function() {
      var level = 'error';
      findlyLog.logLevel(level);
      expect(findlyLog.logLevel()).toBe(level.toUpperCase());
    });

    it('should set log level if level is "INFO"', function() {
      var level = 'INFO';
      findlyLog.logLevel(level);
      expect(findlyLog.logLevel()).toBe(level);
    });
  });

  describe('getLogger()', function() {
    it('should return undefined if function is called with invalid string', function() {
      expect(findlyLog.getLogger()).toBeUndefined();
      expect(findlyLog.getLogger(null)).toBeUndefined();
      expect(findlyLog.getLogger(1)).toBeUndefined();
      expect(findlyLog.getLogger('')).toBeUndefined();
    });

    it('should return Logger object if function is called with valid string', function() {
      expect(findlyLog.getLogger('MyLogger')).not.toBeUndefined();
    });
  });
});