/*
 * @Author: your name
 * @Date: 2020-10-24 09:43:50
 * @LastEditTime: 2021-01-14 10:39:56
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
        target: 'http://192.168.1.156:8090',
        // target: 'http://15.15.11.21:8988',
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