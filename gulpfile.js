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
  pkg = require('./package.json');

var outputFilenames = {
  full: 'findly.logger.js',
  min: 'findly.logger.min.js'
};

gulp.task('lint', function () {
  return gulp.src(['./src/**/*.js'])
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

gulp.task('default', function() {
  runSequence('lint', 'build');
});