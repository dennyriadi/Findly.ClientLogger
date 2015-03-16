# Findly.ClientLogger

Common JS logging library on the browser

## Getting Started

### Direct Usage in your page

```html
<script src="dist/findly.logger.js"></script>
<script>
var poliLog = FindlyLogger.getLogger('Pollinator');
</script>
```

### As a module

```html
var findlyLogger = require('findly-client-logger'),;
  logger = findlyLogger.getLogger('Pollinator');
```

## Log Levels

There are 7 log levels:
* TRACE
* DEBUG
* INFO (Default)
* WARN
* ERROR
* FATAL
* OFF

Examples to configure log levels:

```html
// Log level enums
var errorLogLevel = FindlyLogger.logLevels.ERROR;

// Getting current log level
var logLevel = FindlyLogger.logLevel();

// Setting new log level (as usual, setting lower level will surpress higher level logging)
FindlyLogger.logLevel(errorLogLevel);    //Only ERROR and FATAL logs will be recorded
```

## Logger

### Creating new logger object

```html
var newLogger = FindlyLogger.getLogger("NewLogger");
```

Logger object consists of various functions that log message depending on its specific log level. Example output will look like:

*[16 Mar 2015 15:37:27 | INFO] NewLogger - This is an example of info message.*

```html
newLogger.trace(message[, message2, ... ][, exception]);
newLogger.debug(message[, message2, ... ][, exception]);
newLogger.info(message[, message2, ... ][, exception]);
newLogger.warn(message[, message2, ... ][, exception]);
newLogger.error(message[, message2, ... ][, exception]);
newLogger.fatal(message[, message2, ... ][, exception]);
```

## Log Appender

Currently, Findly Client Logger supports adding/ removing AJAX only appenders. This means that it allows log messages to be send to the server via HTTP POST request. Examples of adding/ removing appenders:

```html
// Telling logger to send log messages to http://localhost:8081/log
FindlyLogger.addAppender('http://localhost:8081/log');
// Adding a new log server
FindlyLogger.addAppender('http://findly-log/log');
// Remove an existing appender
FindlyLogger.removeAppender('http://localhost:8081/log');
```

An example of POST data sent by the API:
```javascript
{
  "data": [
    {
      "logger": "NewLogger",
      "timestamp": 1426474210652,
      "level": "WARN",
      "url": "http://localhost:63342/test/test.html",
      "message": "This is an example of warning message."
    }
  ]
  "layout": "JsonLayout"
}
```

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Denny Riadi  
Licensed under the Findly license.
