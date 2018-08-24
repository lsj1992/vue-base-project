/**
 *  工之保获取码表列表接口
 */
import request from '@/utils/request'

export function getConfigCodeList(data) {
  // const data = {
  //   page: 1,
  //   pageSize: 10,
  //   token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ6dCIsImV4cCI6MTUzNTUwNjY1OCwidXNlcklkIjoiYmI0NmQ1NTQtYTFmNC0xMWU4LWJkNDctNTI1NGM0YzNmMzI5IiwiaWF0IjoxNTM1MDc0NjU4fQ.oxmxK0dfo9jOlgZgkDEqLcsbuyf_mEg45BP6i4pt8co'
  // }
  return request({
    url: '/crm/configCode/queryConfig',
    method: 'post',
    data
  })
}

/**
 *  根基码表id获取码值列表
 */
// crm/configCode/queryConfigCodeList
export function getCodeValueList(data) {
  return request({
    url: '/crm/configCode/queryConfigCodeList',
    method: 'post',
    data
  })
}

/**
 *  删除码表
 * /crm/configCode/deleteConfig
 * 参数 id
 * 返回参数{"d": 1,"e": "000000","m": "码表删除成功"}
 * e 1成功，0失败
 */
export function delCodeTable(data) {
  return request({
    url: '/crm/configCode/deleteConfig',
    method: 'post',
    data
  })
}
/**
 *  删除码值
 * /crm/configCode/deleteCode
 */
export function delCodeValue(data) {
  return request({
    url: '/crm/configCode/deleteCode',
    method: 'post',
    data
  })
}

/**
 *  增加码表 或者 码值
 * /crm/configCode/addConfig
 */
// 请求参数：
// {
//   configValue: ''
//   configName: ''
//   configDescription: ''
// }
// {
//   "d": null,
//   "e": "300002",
//   "m": "码表已存在"
// }
// 返回示例二（码表不存在，添加成功）：
// {
//   "d": 1,
//   "e": "000000",
//   "m": "码表新增成功"
// }

export function addOrEditCodeTable(isCodeTable, data) {
  let url = ''
  if (isCodeTable === true) {
    url = '/crm/configCode/addCode'
  } else {
    url = '/crm/configCode/addCode'
  }
  return request({
    url: url,
    method: 'post',
    data
  })
}
