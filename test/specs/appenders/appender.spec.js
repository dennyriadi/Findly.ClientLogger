'use strict';

describe('appender', function() {
  var Appender = require('appender'),
    appender = null,
    logEmitter = require('log-emitter'),
    handler = function() {};

  beforeEach(function() {
    spyOn(logEmitter, 'addListener');
    spyOn(logEmitter, 'removeListener');
    appender = new Appender(handler);
  });

  it('constructor should initialize handler and listen to logEmitter event', function() {
    expect(appender.handler).toEqual(handler);
    expect(logEmitter.addListener).toHaveBeenCalledWith(handler);
  });

  it('destroy() should remove listener handler from logEmitter', function() {
    appender.destroy();
    expect(logEmitter.removeListener).toHaveBeenCalledWith(handler);
  });
});