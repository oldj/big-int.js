/**
 * gulpfile
 * @author jizha.wyj (oldj)
 * @blog http://oldj.net
 */

'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const browserify = require('gulp-browserify');
const mocha = require('gulp-mocha');

gulp.task('test', () => {
    gulp
        .src('./src/**/*.test.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'}))
        // .pipe(mocha({reporter: 'nyan'}))
    ;
});
