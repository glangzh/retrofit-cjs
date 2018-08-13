const path = require('path');
const webpack = require('webpack');
const merge = require('./merge');
const common = require('./webpack.common');

const config = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
});

module.exports = config;