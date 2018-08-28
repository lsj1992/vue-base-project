/**
 * 工之保 工作流模块 模拟数据
 */
import Mock from 'mockjs'
const count = 10
const List = []
const FlowList = []
const FlowRoleList = []
// 班组列表
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    groupName: '@ctitle' // 班组名称
  }))
}
// 根据班组id获取工作流列表
for (let i = 0; i < count; i++) {
  FlowRoleList.push(Mock.mock({
    id: '@increment',
    flowId: '@increment',
    flowName: '@ctitle', // 工作流名称
    isAvailable: Mock.Random.boolean(),
    discrible: '@cparagraph(1)' // 工作流描述
  }))
}
// 获取工作流列表
for (let i = 0; i < count; i++) {
  FlowList.push(Mock.mock({
    id: '@increment',
    flowId: '@increment',
    adminId: '@increment',
    count: Mock.Random.integer(1, 10),
    createTime: Mock.Random.datetime(),
    startTime: Mock.Random.datetime(),
    flowName: '@ctitle', // 工作流名称
    isAvailable: Mock.Random.integer(0, 1),
    flowStatus: Mock.Random.boolean(),
    flowType: Mock.Random.integer(1, 2),
    discrible: '@cparagraph(1)' // 工作流描述
  }))
}

export default {
  /**
   * 班组列表
   * post 请求
   * url  /crm/groupMember/groupList
   */
  getGroupList: config => {
    const result = {
      code: '000000',
      data: List,
      msg: '获取班组列表成功'
    }
    return result
  },
  /**
   * 根据班组id获取工作流列表
   * post 请求
   * url  /crm/flowRole/query
   */
  getQuery: config => {
    const result = {
      code: '000000',
      count: FlowRoleList.length * 5,
      data: FlowRoleList,
      msg: '获取班组列表成功'
    }
    return result
  },
  /**
   * 获取工作流列表
   * post 请求
   * url  /crm/flow/flowList
   */
  getFlowList: config => {
    const result = {
      code: '000000',
      count: FlowList.length * 5,
      data: FlowList,
      msg: '获取班组列表成功'
    }
    return result
  }
}
