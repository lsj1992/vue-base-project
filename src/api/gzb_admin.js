
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
export function deleteRoleTable(data) {
  return request({
    url: '/crm/sumRole/deleteGzbSumRole',
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
