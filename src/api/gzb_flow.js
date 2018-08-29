/**
 *  工之保 工作流 工作流权限 接口
 */
import request, { http } from '@/utils/request'
/**
 * 获取班组列表
 * /crm/groupMember/groupList
 */
export function getGroupList(isCodeTable, data) {
  return request({
    url: '/crm/groupMember/groupList',
    method: 'post',
    data
  })
}
/**
 * 根据班组id获取班组下工作流列表
 * /crm/flowRole/query
 * pageSize: 条数
 * page: 页数
 * allotId: 分配的id
 * allotType: 分配的类型 0->班组 1->企业 2->项目
 */
export function getQuery(data) {
  return request({
    url: '/crm/flowRole/query',
    method: 'post',
    data
  })
}
/**
 * 获取工作流列表
 * /crm/flow/flowList
 * pageSize: 条数
 * page: 页数
 * allotId: 分配的id
 * allotType: 分配的类型 0->班组 1->企业 2->项目
 */
export function getFlowList(data) {
  return request({
    url: '/crm/flow/flowList',
    method: 'post',
    data
  })
}
/**
 * 删除工作流
 * @param {Object} data {ids: 1}
 */
export function deleteFlowList(data) {
  return request({
    url: '/crm/flow/deleteFlowList',
    method: 'post',
    data
  })
}
/**
 * 获取添加工作流时的选择参数
 */
export function getSingleQueryCode(data) {
  return request({
    url: '/crm/configCode/queryCode',
    method: 'post',
    data
  })
}
/**
 * 获取添加工作流时的选择参数
 * @param {Array} data ['NOTICE_TYPE', 'THIRDPARTY_APP']
 */
export function getQueryCode(data) {
  // const queryList = []
  // // const resultDataName = []
  // for (const configValue of data) {
  //   const d = {
  //     configValue: configValue
  //   }
  //   console.log(d)
  //   queryList.push(getSingleQueryCode(d))
  // }
  // queryList.unshift(getGzbSumRoleList())
  // return request({
  //   url: '/crm/sumRole/getGzbSumRoleList',
  //   method: 'post',
  //   data
  // })
  // return request.post('/crm/sumRole/getGzbSumRoleList')
  // , getSingleQueryCode(data[1]), getSingleQueryCode(data[2])

  return http.all([
    getGzbSumRoleList(data[0]),
    getSingleQueryCode(data[1]),
    getSingleQueryCode(data[2])
  ])
}
/**
 * 获取班组负责人列表
 */
export function getGzbSumRoleList(data) {
  return request({
    url: '/crm/sumRole/getGzbSumRoleList',
    method: 'post',
    data
  })
}

