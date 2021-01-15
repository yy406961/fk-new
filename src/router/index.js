/*
 * @Author: your name
 * @Date: 2021-01-09 09:54:55
 * @LastEditTime: 2021-01-14 14:39:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "@/router/home"
import keyPerson from "@/router/keyPerson"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/fk/keyPerson'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index')
  },
  {
    path: '/fk',
    name: 'fk',
    component: () => import('../components/layout/index'),
    children: [
      ...home,
      ...keyPerson
    ]
  }
]

const router = new VueRouter({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  mode: 'hash',
  routes
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router
