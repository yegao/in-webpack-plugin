'use strict'
const path = require('path')
module.exports = {
  dev: {
    assetsSubDirectory: 'static',//资源子目录
    assetsPublicPath: '/develop',//资源在服务器上的前缀
    proxyTable: {},//定义开发服务器的代理规则
    host: 'localhost', //服务器主机(域名),可以被process.env.HOST重写
    port: 8080, //开发服务器监听的特定端口,可以被process.env.PORT重写,如果端口已经被使用了,就会使用一个随机的端口
    autoOpenBrowser: false,//默认在浏览器中打开
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, 
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),//index.html模板
    assetsRoot: path.resolve(__dirname, '../dist'),//资源根目录
    assetsSubDirectory: 'static',//资源子目录
    assetsPublicPath: '/',
    productionSourceMap: true,//在构建生产环境版本时是否开启source map
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
