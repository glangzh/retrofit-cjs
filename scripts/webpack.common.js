const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ROOT = path.resolve(__dirname, '..');

const config = {
    entry: path.join(ROOT, 'web/index.js'),
    module: {
        // 配置匹配规则
        rules: [
            // test 用来配置匹配文件规则（正则）
            // use  是一个数组，按照从后往前的顺序执行加载
            // 打包 css
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // 打包 图片文件
            {
                test: /\.(jpg|png|gif|jpeg)$/,
                use: 'url-loader'
            },
            // 打包 字体文件
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            },
            // 打包 saas
            {
                test: /\.(scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            // babel
            // exclude 排除，不需要编译的目录，提高编译速度
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new htmlWebpackPlugin({
            // 模板页面路径
            template: path.join(ROOT, './web/index.html')
        })
    ],
    output: {
        path: path.resolve(ROOT, 'dist'),
        filename: '[name].bundle.js'
    }
};

module.exports = [config];