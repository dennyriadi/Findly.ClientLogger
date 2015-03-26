'use strict';

function createLog() {
  return require('./findly-log.js');
}

if (typeof window.define === 'function' && window.define.amd) {
  // AMD. Register as an anonymous module.
  window.define(createLog);
} else if (typeof window.module !== 'undefined' && typeof window.exports === 'object') {
  // Node/CommonJS style
  module.exports = createLog();
} else {
  // No AMD or CommonJS support so we place log4javascript in (probably) the global variable
  window.FindlyLogger = createLog();
}