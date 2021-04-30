const path = require('path')
const isDev = process.env.RUN_NODE_ENV === 'dev'
console.log(isDev)
module.exports = {
  configureWebpack: {
    // 代码地图(仅在开发环境中生效)
    devtool: isDev ? 'inline-source-map' : 'none',
    resolve: {
      // 设置别名
      alias: {
        // 解决vue-i18n在开发环境下发出警告信息问题
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js' // 这样配置后 @ 可以指向 src 目录
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://seller-test.perfee.com',
        changeOrigin: true, // 跨域
        pathRewrite: { '^/api': '' }
      },
      '/test': {
        target: 'https://seller-test.perfee.com',
        changeOrigin: true, // 跨域
        pathRewrite: { '^/api': '' }
      },
      '/prod': {
        target: 'https://seller-test.perfee.com',
        changeOrigin: true, // 跨域
        pathRewrite: { '^/api': '' }
      }
    }
  },
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      // sass-resources-loader  sass注册全局css变量
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          // resources: './path/to/resources.scss',

          // Or array of paths
          resources: [
            path.join(__dirname, 'src', 'assets', 'css', 'theme', 'mixin.scss'), // 主题scss
            path.join(__dirname, 'src', 'assets', 'css', 'common.scss') // 全局通用 scss 变量
          ]
        })
        .end()
    })
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }

    return config
  }
}
