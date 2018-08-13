let webpackConfig;
// 要使用 env 变量，你必须将 module.exports 转换成一个函数
module.exports = env => {
    switch (env.NODE_ENV) {
        case 'prod':
        case 'production':
            webpackConfig = require('./scripts/webpack.prod.js');
            break;
        case 'common':
            webpackConfig = require('./scripts/webpack.common.js');
            break;
        case 'dev':
        case 'development':
        default:
            webpackConfig = require('./scripts/webpack.dev.js');
    }
    return webpackConfig;
}