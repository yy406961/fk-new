/*
 * @Author: your name
 * @Date: 2021-01-09 10:08:15
 * @LastEditTime: 2021-01-09 10:08:34
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\router\home.js
 */
export default [
  {
    name: 'fk.home',
    path: '/fk/home',
    component: () => import('../views/home/index'),
    meta: {
      title: "首页",
      type: '首页'
    }
  }
]