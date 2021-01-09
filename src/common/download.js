/*
 * @Author: your name
 * @Date: 2021-01-09 10:00:55
 * @LastEditTime: 2021-01-09 10:03:00
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\common\download.js
 */
import { Message } from 'element-ui'
import axios from 'axios'
import QS from 'qs'
import router from "@/router";
import { showLoading, hideLoading } from '@/util/loading'

const service = axios.create({
  baseURL: '/api',
  responseType: 'blob',
  // baseURL: 'http://rap2api.taobao.org/app/mock/268576/',
  timeout: 8000,
  withCredentials: true
})

/**
 * 通用request封装
 * @param method
 * @param url
 * @param data
 * @param config
 * @returns {Promise}
 */
const request = (method, url, data, config = {}) => {
  const options = Object.assign({}, config, {
      url,
      method,
      data
  })
  showLoading()
  options.headers = options.headers || {}
  return new Promise((resolve, reject) => {
      service
          .request(options)
          .then(res => {
            if (res.status === 200) {
              if (res.data.code === 100) {
                // 超时 重新登录
                Message({
                  message: res.data.message,
                  type: 'error'
                })
                hideLoading()
                router.push({path:'/'});
              }else{
                hideLoading()
                resolve(res.data)
              }
            } else {
              hideLoading()
              resolve(res.data)
            }
          })
          .catch(error => {
            hideLoading()
            resolve(error)
          })
  })
}

export function download(url, params, config = {}) {
  return request('get', (url + '?' + QS.stringify(params)), params, config)
}

export function downloadPost(url, params, config = {}) {
  return request('post', url, QS.stringify(params, {allowDots: true}), config)
}