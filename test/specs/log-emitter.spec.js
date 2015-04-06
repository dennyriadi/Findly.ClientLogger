'use strict';

describe('log-emitter', function() {
  var logEmitter = require('log-emitter'),
    actualLogEvent = null,
    expectedLogEvent = {
      level: 'WARN',
      category: 'category',
      message: 'msg',
      timestamp: Date.now()
    },
    handler = function(logEvent) {
      actualLogEvent = logEvent;
    };

  beforeEach(function() {
    actualLogEvent = null;
  });

  it('should execute handler when listener exists and emit() is called', function() {
    logEmitter.addListener(handler);
    logEmitter.emit(expectedLogEvent);
    expect(actualLogEvent).toEqual(expectedLogEvent);
    logEmitter.removeListener(handler);
  });

  it('should NOT execute handler when listener doesnt exist and emit() is called', function() {
    logEmitter.addListener(handler);
    logEmitter.removeListener(handler);
    logEmitter.emit(expectedLogEvent);
    expect(actualLogEvent).toBeNull();

  });
});