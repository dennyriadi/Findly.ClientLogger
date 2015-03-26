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

logUtils.forEach = function(array, func) {
  if (!array.hasOwnProperty('length')) {
    return;
  }

  for (var i = 0; i < array.length; i++) {
    func(array[i]);
  }
};

logUtils.reduce = function(obj, baseValue, func) {
  var base = baseValue;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      base = func(base, prop, obj[prop]);
    }
  }
  return base;
};

module.exports= logUtils;