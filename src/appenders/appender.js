'use strict';

var logEmitter = require('../log-emitter.js');

function Appender(handler) {
  this.handler = handler;
  logEmitter.addListener(this.handler);
}

Appender.prototype.destroy = function() {
  logEmitter.removeListener(this.handler);
};

module.exports = Appender;