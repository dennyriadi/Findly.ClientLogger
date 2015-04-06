'use strict';

var logUtils = {};

logUtils.isString = function(input) {
  return (typeof input === 'string');
};

logUtils.isFunction = function(input) {
  return (typeof input === 'function');
};

logUtils.isObject = function(input) {
  return (typeof input === 'object' && input);
};

logUtils.isArray = function(input) {
  return this.isObject(input) && (typeof input.length === 'number');
};

logUtils.forEach = function(coll, func) {
  if (!this.isFunction(func)) {
    return;
  }

  if (this.isArray(coll)) {
    for (var i = 0; i < coll.length; i++) {
      func(coll[i]);
    }
    return;
  }

  if (!this.isObject(coll)) {
    return;
  }

  for (var prop in coll) {
    if (coll.hasOwnProperty(prop)) {
      func(prop, coll[prop]);
    }
  }
};

logUtils.reduce = function(coll, baseValue, func) {
  var base = baseValue;
  logUtils.forEach(coll, function(k, v) {
    base = func(base, k, v);
  });
  return base;
};

module.exports= logUtils;