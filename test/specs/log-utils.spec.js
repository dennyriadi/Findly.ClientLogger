'use strict';

describe('log-utils', function() {
  var lu = require('log-utils'),
    emptyFunc = function() {};

  describe('isString()', function() {
    it('should return false if called with non-string', function() {
      expect(lu.isString()).toBeFalsy();
      expect(lu.isString(null)).toBeFalsy();
      expect(lu.isString({})).toBeFalsy();
      expect(lu.isString(1)).toBeFalsy();
      expect(lu.isString(true)).toBeFalsy();
      expect(lu.isString(emptyFunc)).toBeFalsy();
    });

    it('should return true if called with string', function() {
      expect(lu.isString('')).toBeTruthy();
      expect(lu.isString('string')).toBeTruthy();
    });
  });

  describe('isFunction()', function() {
    it('should return false if called with non-function', function() {
      expect(lu.isFunction()).toBeFalsy();
      expect(lu.isFunction(null)).toBeFalsy();
      expect(lu.isFunction({})).toBeFalsy();
      expect(lu.isFunction(1)).toBeFalsy();
      expect(lu.isFunction(true)).toBeFalsy();
      expect(lu.isFunction('')).toBeFalsy();
      expect(lu.isFunction(emptyFunc())).toBeFalsy();
    });

    it('should return true if called with a function', function() {
      expect(lu.isFunction(emptyFunc)).toBeTruthy();
    });
  });

  describe('isObject()', function() {
    it('should return false if called with primitive data type', function() {
      expect(lu.isObject()).toBeFalsy();
      expect(lu.isObject(1)).toBeFalsy();
      expect(lu.isObject(true)).toBeFalsy();
      expect(lu.isObject('')).toBeFalsy();
      expect(lu.isObject(emptyFunc)).toBeFalsy();
    });

    it('should return false if called with null', function() {
      expect(lu.isObject(null)).toBeFalsy();
    });

    it('should return true if called with array', function() {
      expect(lu.isObject([])).toBeTruthy();
    });

    it('should return true if called with JSON', function() {
      expect(lu.isObject({})).toBeTruthy();
    });
  });

  describe('isArray()', function() {
    it('should return false if called with primitive data type', function() {
      expect(lu.isArray()).toBeFalsy();
      expect(lu.isArray(1)).toBeFalsy();
      expect(lu.isArray(true)).toBeFalsy();
      expect(lu.isArray('')).toBeFalsy();
      expect(lu.isArray(emptyFunc)).toBeFalsy();
    });

    it('should return false if called with null', function() {
      expect(lu.isArray(null)).toBeFalsy();
    });

    it('should return false if called with JSON', function() {
      expect(lu.isArray({})).toBeFalsy();
    });

    it('should return true if called with array', function() {
      expect(lu.isArray([])).toBeTruthy();
    });
  });

  describe('forEach()', function() {
    it('should not perform iteration against non object or array', function() {
      var result;
      lu.forEach(1, function(val) {
        result = val;
      });
      expect(result).toBeUndefined();
    });

    it('should not perform iteration when function is called without valid iterator  function', function() {
      var result;
      lu.forEach([1, 2, 3]);
      expect(result).toBeUndefined();
    });

    it('should perform iteration against object', function() {
      var input = { x: 123, y: 'abc', z: {}},
        result = {};

      lu.forEach(input, function(key, val) {
        result[key] = val;
      });
      expect(result).toEqual(input);
    });

    it('should perform iteration against array', function() {
      var input = [1, 2, 3],
        result = [];
      lu.forEach(input, function(val) {
        result.push(val * 3);
      });
      expect(result).toEqual([3, 6, 9]);
    });
  });
});