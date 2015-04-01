# Findly.ClientLogger

A lightweight client logging library that works on the browser.

## Getting Started

### Package manager supports

The library is obtainable through *npm* and *bower*.

### Direct usage in your page

```html
<script src="dist/findly.logger.min.js"></script>
<script>
  var newLog = FindlyLog.getLogger('NewLog');
</script>
```

### As a module in CommonJS/ NodeJS environment

```javascript
var findlyLog = require('findly-client-logger'),
  newLog = findlyLog.getLogger('NewLog');
```

### As a dependency in AMD/ RequireJS environment

```javascript
define(["./lib/findly.logger.min.js"], function(findlyLog) {
    return function(logName) {
        return findlyLog.getLogger(logName);
    };
  }
);
```

## Log Levels

*FindlyLog.levels* attribute is used to access all log levels.

The library contains 5 levels of logging:
* **DEBUG**
* **INFO (Default)**
* **WARN**
* **ERROR**
* **OFF**


```javascript
var infoLogLevel = FindlyLog.levels.INFO;

// Will print "WARN" on alert dialog box.
alert(FindlyLog.levels.WARN);
```

### Getting and setting log level

*FindlyLog.logLevel()* function is used to read/ write current log level. The library only captures logs which level are lower than or equal to current log level (e.g. setting current log level to WARN will not capture DEBUG nor INFO logs)

```javascript
// Getting current log level
var logLevel = FindlyLog.logLevel();

// Setting new log level
FindlyLog.logLevel(FindlyLog.levels.OFF);    //Will turn off all logs
```

## Logger

### Creating new logger object

```javascript
var newLogger = FindlyLog.getLogger("NewLogger");
```

### Writing log messages using *Logger* object

Logger object consists of various functions that write log message with a specific log level.

```javascript
var message = 'This is a log message.';
newLogger.debug(message);
newLogger.info(message);
newLogger.warn(message);
newLogger.error({code: 404, message: 'Not Found'});
```

## Log Appenders

### Console Appender

The library by default generates console appender. This means that browsers (ones that support *window.console*) will start printing log messages when logger object is created and used.

Console output will look like:

```
[Mon Mar 30 2015 15:29:32 GMT+1300 (New Zealand Daylight Time) | INFO] NewLogger: This is a log message.

[Mon Mar 30 2015 15:29:32 GMT+1300 (New Zealand Daylight Time) | ERROR] NewLogger: {"code":404,"message":"Not Found"}
```

### Logentries Appender

The library supports sending log messages to LogEntries server for further debugging and monitoring. *FindlyLog.addLogEntriesAppender()* and *FindlyLog.removeLogEntriesAppender()* functions are used to initialize and remove the appender respectively.

```javascript
// adding new logentries appender
FindlyLog.addLogEntriesAppender('logEntriesToken');

// removing existing appender
FindlyLog.removeLogEntriesAppender('logEntriesToken');
```

### Custom Appender

There may be a situation where a team needs to implement a custom log handler. The library allows the consumer app to attach and remove custom log handler by calling *FindlyLog.addCustomAppender()* and *FindlyLog.removeCustomAppender()* functions respectively. The custom handler function should expect to receive input parameter called *logEvent* (please see [LogEvent section in Appendix](#LogEvent) for more information about the object.

```javascript
var customLogName = 'myCustomLogAppender',
  handler = function(logEvent) {
    // do something with the logEvent
  };

// adding new custom appender
FindlyLog.addCustomAppender(customLogName, handler);

// removing existing appender
FindlyLog.removeCustomAppender(customLogName);
```

## Appendix

### LogEvent

Attributes:

| Attr Name     | Type          |
| ------------- | -------------:|
| level         | string        |
| category      | string        |
| message       | string/JSON   |
| timestamp     | number        |


Example:
```javascript
logEvent = {
  "level": "WARN",
  "category": "SomeObj",
  "message": "This is a warning message!",
  "timestamp: 1427761088516
}
```

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Denny Riadi  
Licensed under the Findly license.
