'use strict';

const babel = require('gulp-babel');
const flow = require('gulp-flowtype-opensrcken');
const flowRemoveTypes = require('gulp-flow-remove-types');
const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const lazypipe = require('lazypipe');

const typecheck = lazypipe()
  .pipe(flow, {
    all: false,
    weak: false,
    declarations: './declarations',
    killFlow: false,
    beep: true,
    abort: true
  })
  .pipe(flowRemoveTypes, {
    pretty: true
  })
  .pipe(babel);

gulp.task('test', () => gulp.src('test/**/*.js')
  .pipe(typecheck())
  .pipe(gulp.dest('build_test'))
  .pipe(jasmine())
);

gulp.task('build', () => gulp.src('src/**/*.js')
  .pipe(typecheck())
  .pipe(gulp.dest('build'))
);
