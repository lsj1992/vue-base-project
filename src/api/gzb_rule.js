import request from '@/utils/request'

// export function getGzbRule(data) {
//   return request({
//     url: '/crm/flowRole/update',
//     method: 'post',
//     data
//   })
// }
// 获取班组
export function getGroupList(data) {
  return request({
    url: '/crm/groupMember/groupList',
    method: 'post',
    data
  })
}
export function getGroupFlow(data) {
  return request({
    url: '/crm/groupMember/groupFlow',
    method: 'post',
    data
  })
}
export function getFlowRole(data) {
  return request({
    url: '/crm/groupMember/flowRole',
    method: 'post',
    data
  })
}
export function addGroupMember(data) {
  return request({
    url: '/crm/groupMember/flowRoleUser',
    method: 'post',
    data
  })
}
export function addMember(data) {
  return request({
    url: '/crm/groupMember/addGroupMember',
    method: 'post',
    data
  })
}
