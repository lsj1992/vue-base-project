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
