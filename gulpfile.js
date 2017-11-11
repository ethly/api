'use strict';

const gulp = require('gulp');
const setupBuild = require('ethly-deploy');

setupBuild(gulp, 'src', 'test', 'build', 'build_test');
