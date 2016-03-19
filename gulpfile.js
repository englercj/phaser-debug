'use strict';

const gulp      = require('gulp');
const gutil     = require('gulp-util');
const tslint    = require('gulp-tslint');
const del       = require('del');
const runSeq    = require('run-sequence');
const webpack   = require('webpack');

const webpackConfig = require('./webpack.config.js');

const webpackDevConfig = Object.create(webpackConfig);
webpackDevConfig.devtool = 'source-map';
webpackDevConfig.debug = true;
webpackDevConfig.watch = true;
webpackDevConfig.cache = true;

/**
 * default - Task to run when no task is specified.
 */
gulp.task('default', ['build']);

/**
 * build - Builds the bundle and processes resources.
 */
gulp.task('build', function (done) {
    runSeq('lint', ['webpack:build'], done);
});

/**
 * dev - Development build meant for rebuilding incrementally during development.
 */
gulp.task('dev', ['build'], function () {
    return gulp.watch('./src/**/*.ts', ['webpack:build']);
});

/**
 * clean - Cleans the output path.
 */
gulp.task('clean', function () {
    return del(webpackConfig.output.path);
});

/**
 * lint - Runs a fine-toothed comb over the typescript to remove lint.
 */
gulp.task('lint', function () {
    return gulp.src('./src/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

/**
 * webpack:build - Builds the webpack bundle.
 */
gulp.task('webpack:build', function (done) {
    webpack(process.env.NODE_ENV === 'production' ? webpackConfig : webpackDevConfig, (err, stats) => {
        if (err)
            throw new gutil.PluginError('webpack', err);

        gutil.log('[webpack]', stats.toString({ colors: true }));

        done();
    });
});
