'use strict';

describe('config', function() {
  var config = require('config');
  it('should have function called level', function() {
    expect(typeof config.level).toBe('function');
  });

  it('should be able to get config level', function() {
    expect(config.level()).toBe('INFO');
  });

  it('should be able to set config level', function() {
    var configLevel = 'WARN';
    config.level(configLevel);
    expect(config.level()).toBe(configLevel);
  });
});
