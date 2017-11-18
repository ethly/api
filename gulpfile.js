'use strict';

const gulp = require('gulp');
const setupBuild = require('ethly-deploy');

setupBuild(gulp, 'src', 'build', 'build_test');
