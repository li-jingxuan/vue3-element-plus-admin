const path = require('path')
const isDev = !['prod', 'build'].includes(process.env.VUE_APP_ENV)
console.log('isDev', isDev)
module.exports = {
  // productionSourceMap: isDev,
  devServer: {
    port: 8888,
    proxy: {
      // 无开发服，目前不可用
      // '/api': {
      //   target: 'https://seller-test.perfee.com',
      //   changeOrigin: true, // 跨域
      //   pathRewrite: { '^/api': '' }
      // },
      '/test': {
        target: 'https://s2bdnx-test.perfee.com/api/',
        changeOrigin: true, // 跨域
        pathRewrite: { '^/test': '' }
      },
      '/prod': {
        target: 'https://s2bdnx.perfee.com/api/',
        changeOrigin: true, // 跨域
        pathRewrite: { '^/prod': '' }
      }
    }
  },
  // 会合并到webpack的配置中
  configureWebpack: () => {
    const vueI18nAlias = {
      // 解决vue-i18n在开发环境下发出警告信息问题
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js' // 这样配置后 @ 可以指向 src 目录
    }
    const wconf = {
      devtool: 'none',
      resolve: {},
      plugins: []
      // 外部资源配置
      // externalsType: 'commonjs',
      // externals: {
      //   // loadsh: ['http/s://cdn.jsdelivr.net/npm/lodash@4.17.19/lodash.min.js']
      //   southXUtilLib: 'southXUtilLib'
      // }
    }

    if (isDev) {
      wconf.devtool = 'inline-source-map'
      wconf.resolve.alias = Object.assign(
        wconf.resolve.alias || {},
        vueI18nAlias
      )
    }

    if (process.env.NODE_ENV === '') {
      wconf.plugins.push([['transform-remove-console', { exclude: ['error', 'warn'] }]])
    }

    return wconf
  },
  // webpack细颗粒配置，主要是能够使用webpack链式操作
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
