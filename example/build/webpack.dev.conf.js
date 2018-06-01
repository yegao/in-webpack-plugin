'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')//object.assign只是浅拷贝，webpack-merge是会检测webpack属性并选择最优的合并方案的
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')

const inWebpackPlugin = require('../../index.js')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = 'localhost';
const PORT = 8990;

const devWebpackConfig = merge(baseWebpackConfig, {
  mode:'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  optimization:{
    minimize:false,
    splitChunks: {
      chunks: "all",
      minSize: 30,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: "vendor",
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    },
    runtimeChunk:true
  },
//   // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host, // 'localhost'
    port: PORT || config.dev.port, // 8080
    open: config.dev.autoOpenBrowser, // false //webpack-dev-server之后是否自动在浏览器中打开
    overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      // 'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new inWebpackPlugin(),
    // copy custom static assets
    // from    定义要拷贝的源目录
    // to      定义要拷贝到的目标目录
    // toType  file 或者 dir        可选 默认是文件
    // force   强制覆盖先前的插件     可选 默认false
    // context                     可选 默认base context可用specific context
    // flatten  只拷贝文件不管文件夹  可选 默认是false
    // ignore   忽略拷贝指定的文件    可以用模糊匹配
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = 8990
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      devWebpackConfig.devServer.port = port
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))
      resolve(devWebpackConfig)
    }
  })
})
