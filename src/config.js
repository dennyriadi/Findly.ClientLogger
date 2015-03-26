'use strict';

//var _ = require('lodash');

var logUtils = require('./log-utils.js');

var config = {
  level: 'INFO'
};

module.exports = logUtils.reduce(config, {}, function(result, key) {
  result[key] = function(value) {
    if (arguments.length === 0) {
      return config[key];
    } else {
      config[key] = value;
    }
  };
  return result;
});

//
//module.exports = _.reduce(config, function(result, n, key) {
//  result[key] = function(value) {
//    if (arguments.length === 0) {
//      return config[key];
//    } else {
//      config[key] = value;
//    }
//  };
//  return result;
//}, {});