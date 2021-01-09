/*
 * @Author: your name
 * @Date: 2021-01-09 09:41:34
 * @LastEditTime: 2021-01-09 09:42:28
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\router\keyPerson.js
 */
export default [
  {
    name: 'fk.keyPerson',
    path: '/fk/keyPerson',
    component: () => import('../views/keyPerson/index'),
    meta: {
      title: "重点人信息",
      type: '重点人信息'
    }
  }
]