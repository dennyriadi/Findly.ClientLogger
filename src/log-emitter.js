'use strict';

var events = require('events'),
  eventEmitter = new events.EventEmitter(),
  evName = 'log';

function emit(logEvent) {
  eventEmitter.emit(evName, logEvent);
}

function removeListener(handler) {
  eventEmitter.removeListener(evName, handler);
}

function addListener(handler) {
  eventEmitter.on(evName, handler);
}

module.exports = {
  emit: emit,
  addListener: addListener,
  removeListener: removeListener
};