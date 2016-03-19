'use strict';

const path              = require('path');
const NoErrorsPlugin    = require('webpack/lib/NoErrorsPlugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'phaser-debug.js',
        library: 'Phaser.Plugin.Debug',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['', '.ts', '.js'],
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
        ],
    },
    plugins: [
        // don't emit output when there are errors
        new NoErrorsPlugin(),
    ]
};
