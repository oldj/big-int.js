/**
 * gulpfile
 * @author oldj
 * @blog http://oldj.net
 */

'use strict';

const gulp = require('gulp');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const mocha = require('gulp-mocha');
const header = require('gulp-header');
const rename = require('gulp-rename');

const header_info = `/**
 * JavaScript BigInt
 * @author oldj | http://oldj.net
 * @source https://github.com/oldj/big-int.js
 */\n`;

gulp.task('test', () => {
    gulp
        .src([
            './src/**/*.test.js'
            // './src/**/bigInt.test.js'
        ], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'}))
    ;
});

gulp.task('js', () => {
    gulp
        .src('./src/bigInt.js')
        .pipe(browserify({
            debug: false
        }))
        .pipe(header(header_info))
        .pipe(gulp.dest('./build'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify({
            output: {
                ascii_only: true
            },
            compress: {
                drop_console: true
            }
        }))
        .pipe(header(header_info))
        .pipe(gulp.dest('./build'))
    ;
});

gulp.task('default', () => {
    gulp.start('js');
});
