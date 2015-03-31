'use strict';

var logEmitter = require('../log-emitter.js');

function Appender(name, handler) {
  this.name = name;
  this.handler = handler;
  logEmitter.addListener(this.name, this.handler);
}

Appender.prototype.destroy = function() {
  logEmitter.removeListener(this.name);
};

module.exports = Appender;