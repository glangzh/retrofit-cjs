const webpack = require('webpack');
const merge = require('./merge');
const common = require('./webpack.common.js'); 
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 生产环境中启用 source-map 选项
// 避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。
module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: false
                }
            })
        ]
    }
});