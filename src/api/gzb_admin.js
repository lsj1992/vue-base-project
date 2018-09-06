
import request from '@/utils/request'

export function getSumRoleList(data) {
  return request({
    url: '/crm/sumRole/selectGzbSumRoleList',
    method: 'post',
    data
  })
}
export function getRoleValueList(data) {
  return request({
    url: '/crm/sumRole/getGzbSumRole',
    method: 'post',
    data
  })
}
export function deleteRoleTable(isList, data) {
  let url = '/crm/sumRole/deleteGzbSumRole'
  if (isList) {
    url = '/crm/sumRole/deleteGzbSumRoleList'
  }
  console.log(url)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function addOrEditRoleTable(isRoleTable, data) {
  let url = ''
  if (isRoleTable === true) {
    url = '/crm/sumRole/addGzbSumRole'
  } else {
    url = '/crm/sumRole/addGzbSumRole'
  }
  return request({
    url: url,
    method: 'post',
    data
  })
}
// export function unknown(data) {
//   // const url = '/secret/unknown'
//   const url = '/site/index'
//   return request({
//     url: url,
//     method: 'post',
//     data
//   })
// }
