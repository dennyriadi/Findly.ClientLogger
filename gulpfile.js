'use strict';

// include gulp
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  runSequence = require('run-sequence'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  pkg = require('./package.json');

gulp.task('lint', function () {
  return gulp.src(['./src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('build', function () {
  return browserify(pkg.main, { standalone: 'FindlyLogger' })
    .bundle()
    .pipe(source('findly.logger.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', function() {
  runSequence('lint', 'build');
});