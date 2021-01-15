/*
 * @Author: your name
 * @Date: 2021-01-14 09:40:14
 * @LastEditTime: 2021-01-14 17:20:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\api\keyPerson.js
 */
import { fetchGet, fetchPost } from '@/common/axios.js'

// 获取重点人员分类
export const ZdrPersTree = params => fetchPost('/keyPers/ZdrPersTree', params)

// 获取某类重点人数据
export const ZdrLatAndLngQuery = params => fetchPost('/keyPers/ZdrLatAndLngQuery', params)

// 查询不同类型的重点人
export const QueryDifferentTypes = params => fetchPost('/keyPers/QueryDifferentTypes', params)

// 预警消息
export const getearlyInfoNum = params => fetchPost('/keyPers/getearlyInfoNum', params)

// 单条预警消息 查看位置
export const EarlyPersonLatAndLngQuery = params => fetchPost('/keyPers/EarlyPersonLatAndLngQuery', params)

// 类型统计值
export const countData = params => fetchPost('/keyPers/countData', params)

// l历史轨迹查询 
export const lsgjInfo = params => fetchPost('/authorizat/lsgjInfo', params)

// 号码基础信息查询
export const searchvirtualId = params => fetchPost('/authorizat/searchvirtualId', params)

// 号码所属姓名查询
export const isExist = params => fetchPost('/authorizat/isExist', params)

// APP日志查询
export const getAPPTop = params => fetchPost('/authorizat/getAPPTop', params)

// 上网日志查询 
export const getURLTop = params => fetchPost('/authorizat/getURLTop', params)