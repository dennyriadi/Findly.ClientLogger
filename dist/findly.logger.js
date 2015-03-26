(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./findly-log.js":8}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
/**
 * @license Copyright 2013 Logentries.
 * Please view license at https://raw.github.com/logentries/le_js/master/LICENSE
 */

/*global define, module, exports */

/** @param {Object} window */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([root], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(root);
    } else {
        // Browser globals (root is window)
        root.LE = factory(root);
    }
}(this, function(window) {
    "use strict";

    /**
     * A single log event stream.
     * @constructor
     * @param {Object} options
     */
    function LogStream(options) {
        /**
         * @const
         * @type {string} */
        var _traceCode = (Math.random() + Math.PI).toString(36).substring(2, 10);
        /** @type {boolean} */
        var _doTrace = options.trace;
        /** @type {string} */
        var _pageInfo = options.page_info;
        /** @type {string} */
        var _token = options.token;
        /** @type {boolean} */
        var _print = options.print;
        /**
         * @const
         * @type {string} */
        var _endpoint = "js.logentries.com/v1";

        /**
         * Flag to prevent further invocations on network err
         ** @type {boolean} */
        var _shouldCall = true;
        /** @type {boolean} */
        var _SSL = function() {
            if (typeof XDomainRequest === "undefined") {
                return options.ssl;
            }
            // If we're relying on XDomainRequest, we
            // must adhere to the page's encryption scheme.
            return window.location.protocol === "https:" ? true : false;
        }();
        /** @type {Array.<string>} */
        var _backlog = [];
        /** @type {boolean} */
        var _active = false;
        /** @type {boolean} */
        var _sentPageInfo = false;

        if (options.catchall) {
            var oldHandler = window.onerror;
            var newHandler = function(msg, url, line) {
                _rawLog({error: msg, line: line, location: url}).level('ERROR').send();
                if (oldHandler) {
                    return oldHandler(msg, url, line);
                } else {
                    return false;
                }
            };
            window.onerror = newHandler;
        }

        var _agentInfo = function() {
            var nav = window.navigator || {doNotTrack: undefined};
            var screen = window.screen || {};
            var location = window.location || {};

            return {
              url: location.pathname,
              referrer: document.referrer,
              screen: {
                width: screen.width,
                height: screen.height
              },
              window: {
                width: window.innerWidth,
                height: window.innerHeight
              },
              browser: {
                name: nav.appName,
                version: nav.appVersion,
                cookie_enabled: nav.cookieEnabled,
                do_not_track: nav.doNotTrack
              },
              platform: nav.platform
            }
        };

        var _getEvent = function() {
            var raw = null;
            var args = Array.prototype.slice.call(arguments);
            if (args.length === 0) {
                throw new Error("No arguments!");
            } else if (args.length === 1) {
                raw = args[0];
            } else {
                // Handle a variadic overload,
                // e.g. _rawLog("some text ", x, " ...", 1);
              raw = args;
            }
            return raw;
        };

        // Single arg stops the compiler arity warning
        var _rawLog = function(msg) {
            var event = _getEvent.apply(this, arguments);

            var data = {event: event};

            // Add agent info if required
            if (_pageInfo !== 'never') {
                if (!_sentPageInfo || _pageInfo === 'per-entry') {
                    _sentPageInfo = true;
                    if (typeof event.screen === "undefined" &&
                        typeof event.browser === "undefined")
                      _rawLog(_agentInfo()).level('PAGE').send();
                }
            }

            // Add trace code if required
            if (_doTrace) {
                data.trace = _traceCode;
            }

            return {level: function(l) {
                // Don't log PAGE events to console
                // PAGE events are generated for the agentInfo function
                    if (_print && typeof console !== "undefined" && l !== 'PAGE') {
                      try {
                        console[l.toLowerCase()].call(console, data);
                      } catch (ex) {
                        // IE compat fix
                        console.log(data);
                      }
                    }
                    data.level = l;

                    return {send: function() {
                        var cache = [];
                        var serialized = JSON.stringify(data, function(key, value) {

                          // cross-browser indexOf fix
                          var _indexOf = function(array, obj) {
                            for (var i = 0; i < array.length; i++) {
                              if (obj === array[i]) {
                                return i;
                              }
                            }
                            return -1;
                          }
                              if (typeof value === "undefined") {
                                return "undefined";
                              } else if (typeof value === "object" && value !== null) {
                                if (_indexOf(cache, value) !== -1) {
                                  // We've seen this object before;
                                  // return a placeholder instead to prevent
                                  // cycles
                                  return "<?>";
                                }
                                cache.push(value);
                              }
                          return value;
                        });

                            if (_active) {
                                _backlog.push(serialized);
                            } else {
                                _apiCall(_token, serialized);
                            }
                        }};
                }};
        };

        /** @expose */
        this.log = _rawLog;

        var _apiCall = function(token, data) {
            _active = true;

            // Obtain a browser-specific XHR object
            var _getAjaxObject = function() {
              if (typeof XDomainRequest !== "undefined") {
                // We're using IE8/9
                return new XDomainRequest();
              }
              return new XMLHttpRequest();
            };

            var request = _getAjaxObject();

            if (_shouldCall) {
                if (request.constructor === XMLHttpRequest) {
                    // Currently we don't support fine-grained error
                    // handling in older versions of IE
                    request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        // Handle any errors
                        if (request.status >= 400) {
                            console.error("Couldn't submit events.");
                            if (request.status === 410) {
                                // This API version has been phased out
                                console.warn("This version of le_js is no longer supported!");
                            }
                        } else {
                            if (request.status === 301) {
                                // Server issued a deprecation warning
                                console.warn("This version of le_js is deprecated! Consider upgrading.");
                            }
                            if (_backlog.length > 0) {
                                // Submit the next event in the backlog
                                _apiCall(token, _backlog.shift());
                            } else {
                                _active = false;
                            }
                        }
                    }

                    }
                } else {
                  request.onload = function() {
                    if (_backlog.length > 0) {
                      // Submit the next event in the backlog
                      _apiCall(token, _backlog.shift());
                    } else {
                      _active = false;
                    }
                  }
                }

                var uri = (_SSL ? "https://" : "http://") + _endpoint + "/logs/" + _token;
                request.open("POST", uri, true);
                if (request.constructor === XMLHttpRequest) {
                    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    request.setRequestHeader('Content-type', 'text/json');
                }
                request.send(data);
            }
        };
    }

    /**
     * A single log object
     * @constructor
     * @param {Object} options
     */
    function Logger(options) {
        var logger;

        // Default values
        var dict = {
            ssl: true,
            catchall: false,
            trace: true,
            page_info: 'never',
            print: false,
            token: null
        };

        if (typeof options === "object")
            for (var k in options)
                dict[k] = options[k];
        else
            throw new Error("Invalid parameters for createLogStream()");

        if (dict.token === null) {
            throw new Error("Token not present.");
        } else {
            logger = new LogStream(dict);
        }

        var _log = function(msg) {
            if (logger) {
                return logger.log.apply(this, arguments);
            } else
                throw new Error("You must call LE.init(...) first.");
        };

         // The public interface
        return {
            log: function() {
                _log.apply(this, arguments).level('LOG').send();
            },
            warn: function() {
                _log.apply(this, arguments).level('WARN').send();
            },
            error: function() {
                _log.apply(this, arguments).level('ERROR').send();
            },
            info: function() {
                _log.apply(this, arguments).level('INFO').send();
            }
        };
    }

    // Array of Logger elements
    var loggers = {};

    var _getLogger = function(name) {
        if (!loggers.hasOwnProperty(name))
           throw new Error("Invalid name for logStream");

        return loggers[name]
    };

    var  _createLogStream = function(options) {
        if (typeof options.name !== "string")
            throw new Error("Name not present.");
        else if (loggers.hasOwnProperty(options.name))
            throw new Error("Already exist this name for a logStream");

        loggers[options.name] = new Logger(options);

        return true;
    };

    var _deprecatedInit = function(options) {
        var dict = {
            name : "default"
        };

        if (typeof options === "object")
            for (var k in options)
                dict[k] = options[k];
        else if (typeof options === "string")
            dict.token = options;
        else
            throw new Error("Invalid parameters for init()");

        return _createLogStream(dict);
    };

    var _destroyLogStream = function(name) {
        if (typeof name === 'undefined'){
            name = 'default';
        }

        delete loggers[name];
    };

    // The public interface
    return {
        init: _deprecatedInit,
        createLogStream: _createLogStream,
        to: _getLogger,
        destroy: _destroyLogStream,
        log: function() {
            for (var k in loggers)
                loggers[k].log.apply(this, arguments);
        },
        warn: function() {
            for (var k in loggers)
                loggers[k].warn.apply(this, arguments);
        },
        error: function() {
            for (var k in loggers)
                loggers[k].error.apply(this, arguments);
        },
        info: function() {
            for (var k in loggers)
                loggers[k].info.apply(this, arguments);
        }
    };
}));

},{}],4:[function(require,module,exports){
'use strict';

var logUtils = require('../log-utils.js'),
  logLevels = require('../log-level.js'),
  logEmitter = require('../log-emitter.js');

function handler(logEvent) {
  try {
    var logMessage = (logUtils.isObject(logEvent.message)) ? JSON.stringify(logEvent.message) : logEvent.message;
    window.console[logLevels[logEvent.level].name](
      '[%s | %s] %s: %s',
      new Date(logEvent.timestamp),
      logEvent.level,
      logEvent.category,
      logMessage);
  } catch (ex) {
    // do nothing
  }
}

function ConsoleAppender() {
  if (!window.console) {
    return;
  }

  logEmitter.listen(handler);
}

module.exports = ConsoleAppender;
},{"../log-emitter.js":9,"../log-level.js":11,"../log-utils.js":12}],5:[function(require,module,exports){
'use strict';

var logUtils = require('../log-utils.js'),
  logEmitter = require('../log-emitter.js');

function CustomAppender(handler) {
  if (!logUtils.isFunction(handler)) {
    return;
  }

  logEmitter.listen(handler);
}

module.exports = CustomAppender;
},{"../log-emitter.js":9,"../log-utils.js":12}],6:[function(require,module,exports){
'use strict';

var logUtils = require('../log-utils.js'),
  le = require('le_js'),
  logLevels = require('../log-level.js'),
  logEmitter = require('../log-emitter.js');

function handler(logEvent) {
  try {
    var logFunc = le[logLevels[logEvent.level].name];

    if (logUtils.isFunction(logFunc)) {
      logFunc(logEvent);
    }
  } catch (ex) {
    // do nothing
  }
}

function LogEntriesAppender(token) {
  if (!logUtils.isString(token) || !token) {
    return;
  }
  le.init(token);
  logEmitter.listen(handler);
}

module.exports = LogEntriesAppender;
},{"../log-emitter.js":9,"../log-level.js":11,"../log-utils.js":12,"le_js":3}],7:[function(require,module,exports){
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
},{"./log-utils.js":12}],8:[function(require,module,exports){
'use strict';

var logUtils = require('./log-utils.js'),
  logLevels = require('./log-level.js'),
  config = require('./config.js'),
  Logger = require('./logger.js'),
  ConsoleAppender = require('./appenders/console.js'),
  LogentriesAppender = require('./appenders/logentries.js'),
  CustomAppender = require('./appenders/custom.js');

var levelEnums = {},
  loggers = {},
  logAppenders = {},
  reservedAppenderNames = ['console', 'logentries'],
  FindlyLog = {};

function createConsoleAppender() {
  var consoleAppender = new ConsoleAppender();
  if (consoleAppender) {
    logAppenders.console = consoleAppender;
  }
}

function isReservedAppenderName(name) {
  var result = false;
  name = name.toLowerCase();
  for (var i = 0; i < reservedAppenderNames.length; i++) {
    if (name === reservedAppenderNames[i]) {
      result = true;
      break;
    }
  }
  return result;
}

function validateAppender(name) {
  if (!logUtils.isString(name) || !name ) {
    throw new Error('Invalid appender name.');
  }

  if (isReservedAppenderName(name)) {
    throw new Error('Cannot use a reserved appender name.');
  }

  if (logAppenders.hasOwnProperty(name)) {
    throw new Error('There is an existing appender with the same name.');
  }
}

levelEnums = logUtils.reduce(logLevels, {}, function(result, key) {
  result[key] = key;
  return result;
});

FindlyLog.logLevel = function(level) {
  if (arguments.length === 0) {
    return config.level();
  } else if (levelEnums.hasOwnProperty(level)) {
    config.level(level);
  }
};

FindlyLog.getLogger = function(logName) {
  if (!logUtils.isString(logName) || !logName) {
    return;
  }

  if (loggers.hasOwnProperty(logName)) {
    return loggers[logName];
  }

  loggers[logName] = new Logger(logName);
  return loggers[logName];
};

FindlyLog.addCustomAppender = function (name, handler) {
  validateAppender(name);

  if (!logUtils.isFunction(handler)) {
    throw new Error('Invalid handler function.');
  }

  logAppenders[name] = new CustomAppender(handler);
};

FindlyLog.removeCustomAppender = function(name) {
  if (!isReservedAppenderName(name) && logAppenders.hasOwnProperty(name)) {
    delete logAppenders[name];
  }
};

FindlyLog.addLogEntriesAppender = function(token) {
  if (logAppenders.logentries) {
    throw new Error('There is an existing logentries appender.');
  }
  logAppenders.logentries = new LogentriesAppender(token);
};

FindlyLog.removeLogEntriesAppender = function() {
  if (logAppenders.logentries) {
    delete logAppenders.logentries;
  }
};

FindlyLog.levels = levelEnums;

// by default, we attempt to create console appender
createConsoleAppender();

module.exports = FindlyLog;
},{"./appenders/console.js":4,"./appenders/custom.js":5,"./appenders/logentries.js":6,"./config.js":7,"./log-level.js":11,"./log-utils.js":12,"./logger.js":13}],9:[function(require,module,exports){
'use strict';

var events = require('events'),
  logEmitter = new events.EventEmitter(),
  evName = 'log';

function emit(logEvent) {
  logEmitter.emit(evName, logEvent);
}

function listen(handler) {
  logEmitter.on(evName, handler);
}

module.exports = {
  emit: emit,
  listen: listen
};
},{"events":2}],10:[function(require,module,exports){
'use strict';

function LogEvent(level, category, message) {
  this.level = level;
  this.category = category;
  this.message = message;
  this.timestamp = Date.now();
}

module.exports = LogEvent;
},{}],11:[function(require,module,exports){
'use strict';

module.exports = {
  DEBUG: {
    name: 'log',
    index: 4
  },
  INFO: {
    name: 'info',
    index: 3
  },
  WARN: {
    name: 'warn',
    index: 2
  },
  ERROR: {
    name: 'error',
    index: 1
  },
  OFF: {
    name: 'off',
    index: 0
  }
};
},{}],12:[function(require,module,exports){
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
  if (this.isArray(coll)) {
    for (var i = 0; i < coll.length; i++) {
      func(coll[i]);
    }
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
},{}],13:[function(require,module,exports){
'use strict';

var logUtils = require('./log-utils.js'),
  config = require('./config.js'),
  logLevels = require('./log-level.js'),
  LogEvent = require('./log-event.js'),
  logEmitter = require('./log-emitter.js');

function emitLog(level, name) {
  return function(message) {
    var logEvent,
      configLevel = config.level();
    if (logLevels[configLevel].index >= logLevels[level].index) {
      logEvent = new LogEvent(level, name, message);
      logEmitter.emit(logEvent);
    }
  };
}

function Logger(logName) {
  var self = this;

  if (!logUtils.isString(logName) || !logName) {
    throw new Error('Failed to create Logger, invalid logName: ' + logName);
  }

  logUtils.forEach(['debug', 'info', 'warn', 'error'], function(f) {
    self[f] = emitLog(f.toUpperCase(), logName);
  });
}

module.exports = Logger;
},{"./config.js":7,"./log-emitter.js":9,"./log-event.js":10,"./log-level.js":11,"./log-utils.js":12}]},{},[1]);
