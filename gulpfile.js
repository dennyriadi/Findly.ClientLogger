'use strict';

// include gulp
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  runSequence = require('run-sequence'),
  browserify = require('browserify'),
  uglify = require('gulp-uglify'),
  buffer = require('vinyl-buffer'),
  source = require('vinyl-source-stream'),
  karma = require('karma').server,
  pkg = require('./package.json');

var outputFilenames = {
  full: 'findly.logger.js',
  min: 'findly.logger.min.js'
};

function browserifyAliases(b, aliases) {
  if (b && aliases && aliases.length > 0) {
    for (var i = 0; i < aliases.length; i++) {
      var alias = aliases[i].split(':');
      b.require(alias[0], { expose: (alias[1] || alias[0]) });
    }
  }
  return b;
}

gulp.task('lint', function () {
  return gulp.src(['./src/**/*.js', './test/specs/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('build', function () {
  var destDir = './dist/';

  function browserifyOutput() {
    for (var prop in outputFilenames) {
      var b = browserify(pkg.main)
        .bundle()
        .pipe(source(outputFilenames[prop]))
        .pipe(buffer());

      if (prop === 'min') {
        b = b.pipe(uglify());
      }

      b.pipe(gulp.dest(destDir));
    }
  }

  return browserifyOutput();
});

gulp.task('browserify-test', function () {
  var b = browserifyAliases(
    browserify(pkg.main),
    [
      './src/config.js:config',
      './src/findly-log.js:findly-log',
      './src/log-event.js:log-event',
      './src/log-emitter.js:log-emitter',
      './src/log-utils.js:log-utils',
      './src/logger.js:logger',
      './src/appenders/appender.js:appender'
    ]);

  return b
    .transform('browserify-istanbul')
    .bundle()
    .pipe(source(outputFilenames.full))
    .pipe(gulp.dest('./test/dist/'));
});

gulp.task('test', ['browserify-test'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, function(exitCode) {
    done();
    process.exit(exitCode);
  });
});

gulp.task('default', function() {
  runSequence('lint', 'build', 'test');
});