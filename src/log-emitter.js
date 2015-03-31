'use strict';

var events = require('events'),
  logEmitter = new events.EventEmitter(),
  evName = 'log',
  listeners = {};

function emit(logEvent) {
  logEmitter.emit(evName, logEvent);
}

function removeListener(name) {
  if (listeners.hasOwnProperty(name)) {
    logEmitter.removeListener(evName, listeners[name]);
    delete listeners[name];
  }
}

function addListener(name, handler) {
  if (!listeners.hasOwnProperty(name)) {
    logEmitter.on(evName, handler);
    listeners[name] = handler;
  }
}

module.exports = {
  emit: emit,
  addListener: addListener,
  removeListener: removeListener
};