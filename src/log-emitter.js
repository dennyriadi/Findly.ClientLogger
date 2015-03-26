'use strict';

var events = require('events'),
  logEmitter = new events.EventEmitter(),
  evName = 'log';

function emit(logEvent) {
  logEmitter.emit(evName, logEvent);
}

function listen(handler) {
  logEmitter.on(evName, handler);
}

module.exports = {
  emit: emit,
  listen: listen
};