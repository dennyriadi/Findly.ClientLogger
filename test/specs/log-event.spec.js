'use strict';

describe('log-event', function() {
  var LogEvent = require('log-event'),
    level = 'ERROR',
    category = 'LOG',
    message = {},
    logEvent = new LogEvent(level, category, message);

  it('should have attribute called category', function() {
    expect(logEvent.hasOwnProperty('category')).toBeTruthy();
    expect(logEvent.category).toEqual(category);
  });

  it('should have attribute called message', function() {
    expect(logEvent.hasOwnProperty('message')).toBeTruthy();
    expect(logEvent.message).toEqual(message);
  });

  it('should have attribute called level', function() {
    expect(logEvent.hasOwnProperty('level')).toBeTruthy();
    expect(logEvent.level).toEqual(level);
  });

  it('should have attribute called timestamp', function() {
    expect(logEvent.hasOwnProperty('timestamp')).toBeTruthy();
    expect(logEvent.timestamp).toBeLessThan(Date.now());
  });
});
