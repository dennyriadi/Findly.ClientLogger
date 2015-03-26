'use strict';

function LogEvent(level, category, message) {
  this.level = level;
  this.category = category;
  this.message = message;
  this.timestamp = Date.now();
}

module.exports = LogEvent;