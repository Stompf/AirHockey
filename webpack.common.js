const webpack = require('webpack');
const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: ['./src/client/index.ts'],
    stats: {
        all: false,
        modules: false,
        errors: true,
        warnings: true,
        builtAt: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        chunkFilename: 'vendor.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true),
        }),
    ],
};
