import Mock from 'mockjs'
const count = 10
const List = []
// const adminList = [] // 码值数据
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    sumRoleName: '@ctitle',
    sumRoleApp: '@ctitle',
    sumRoleStatus: Mock.Random.integer(0, 1),
    sumRoleType: Mock.Random.integer(0, 2),
    sumRoleDesc: '@cparagraph(1)'
  }))
}
role => {
  const result = {
    code: 0,
    count: List.length * 5,
    data: List,
    msg: '获取角色列表成功'
  }
  return result
}
// delRoleTableById: role => {
//   const result = {
//     e: '1',
//     d: 1,
//     m: '删除角色成功'
//   }
//   return result
// },
// addSumRoleTable: config => {
//   const result = {
//     e: '000000',
//     d: 1,
//     m: '增加角色成功'
//   }
//   return result
// }
// }
