/*
 * @Author: your name
 * @Date: 2021-01-09 10:01:59
 * @LastEditTime: 2021-01-09 10:02:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state: {
  },
  mutations,
  actions,
  getters,
  modules: {

  },
  plugins: [persistedState({
  })]
})
