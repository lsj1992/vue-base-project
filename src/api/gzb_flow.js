/**
 *  工之保 工作流 工作流权限 接口
 */
import request from '@/utils/request'
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
export function getQuery(isCodeTable, data) {
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
export function getFlowList(isCodeTable, data) {
  return request({
    url: '/crm/flow/flowList',
    method: 'post',
    data
  })
}

