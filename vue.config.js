const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? (process.env.TARGET_PLATFORM === 'ios' ? './' : '/')
      : '/'
})
