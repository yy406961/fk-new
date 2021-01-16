/*
 * @Author: your name
 * @Date: 2020-10-24 09:43:50
 * @LastEditTime: 2021-01-15 16:38:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \case-manage\vue.config.js
 */
module.exports = {
  // publicPath:'/',
  devServer: {
    disableHostCheck: true,
    port: 8080,
    proxy:{
      '/api':{
        // target: 'http://192.168.1.156:8093',
        target: 'http://15.15.11.128:8093',
        changeOrigin: true,
        pathRewrite:{
          '^/api': '/',
          // '^/api': '',
        }
      }
    },
  },
  configureWebpack: {
    externals: {
      BMapGL: 'BMapGL',
      BMapLib: 'BMapLib'
    },
  }
}