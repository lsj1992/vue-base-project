/**
 * 工之保 码表值 模拟数据
 */
import Mock from 'mockjs'
const count = 10
const List = []
const codeVal = {} // 码值数据
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    configName: '@ctitle',
    configValue: '@word',
    configDescription: '@cparagraph(1)'
  }))
}

/**
 * 工之保获取码值列表
 */
const gzb01TConfig = Mock.mock({
  id: '@increment',
  configName: '@ctitle',
  configValue: '@word',
  configDescription: '@cparagraph(1)'
})

const gzb01TConfigCodeList = []
for (let i = 0; i < 3; i++) {
  gzb01TConfigCodeList.push(Mock.mock({
    id: '@increment',
    codeName: '@ctitle', // 码值名称
    codeOrder: '@word', // 码值序号
    codeStatus: Mock.Random.integer(0, 1).toString(), // 状态:0->可见,1->不可见
    codeValue: '@word', // 码值
    configId: '@word', // 码表主键id
    configValue: '@word', // 码表值
    codeDescription: '@cparagraph(1)' // 码值描述
  }))
}

codeVal['gzb01TConfig'] = gzb01TConfig
codeVal['gzb01TConfigCodeList'] = gzb01TConfigCodeList

export default {
  /**
   * 获取码表列表
   */
  getConfigCode: config => {
    const result = {
      code: 0,
      count: List.length * 5,
      data: List,
      msg: '获取码表列表成功'
    }
    return result
  },
  /**
   * 获取码值列表
   */
  getCodeValueList: config => {
    const result = {
      code: 0,
      e: '000000',
      d: codeVal,
      m: '获取码值列表成功'
    }
    return result
  },
  /**
   * 删除码表
   */
  delCodeTableById: config => {
    const result = {
      e: '1',
      d: 1,
      m: '删除码表成功'
    }
    return result
  },
  /**
   * 删除码值
   */
  delCodeValueById: config => {
    const result = {
      e: '1',
      d: 1,
      m: '删除码表成功'
    }
    return result
  },
  /**
   * 增加码表
   */
  addCodeTable: config => {
    const result = {
      e: '000000',
      d: 1,
      m: '增加码表成功'
    }
    return result
  },
  /**
   * 增加码值
   */
  addCodeValue: config => {
    const result = {
      e: '000000',
      d: 1,
      m: '码值修改成功'
    }
    return result
  }
}
