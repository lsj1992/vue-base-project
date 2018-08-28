/**
 * 工之保 图片管理 模拟数据
 */
import Mock from 'mockjs'
const count = 10
const List = []
let bannerMsg = {} // banner详细信息
const bannerList = [] // banner列表
const picList = [] // 图片列表
// banner列表
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    bannerUrl: Mock.Random.dataImage('800x200'), // 临时生成图片用，非必要返回字段[实际改字段表示 图片跳转地址]
    bannerPicId: Mock.Random.integer(60, 100), // 图片id
    picUrl: '@url', // 图片url
    bannerType: Mock.Random.integer(0, 3), // 图片类型，主页、保险、金融
    bannerIndex: Mock.Random.integer(0, 3), // 序号 1->第一张
    bannerDesc: '@cparagraph(1)' // banner图描述
  }))
}

// banner详细信息
for (let i = 0; i < 5; i++) {
  bannerList.push(Mock.mock({
    id: '@increment',
    bannerUrl: Mock.Random.dataImage('800x200'), // 临时生成图片用，非必要返回字段[实际改字段表示 图片跳转地址]
    bannerPicId: Mock.Random.integer(60, 100), // 图片id
    picUrl: '@url', // 图片url
    bannerType: Mock.Random.integer(0, 3), // 图片类型，主页、保险、金融
    bannerIndex: Mock.Random.integer(0, 3), // 序号 1->第一张
    bannerDesc: '@cparagraph(1)' // banner图描述
  }))
}

bannerMsg = {
  id: Mock.Random.increment(), // Banner 的id
  bannerIndex: Mock.Random.integer(0, 3).toString(), // 序号
  bannerPicId: Mock.Random.integer(60, 100), // 图片url
  bannerDesc: Mock.Random.cparagraph(1), // banner的描述
  bannerType: Mock.Random.integer(0, 3).toString(), // banner的类型
  bannerUrl: Mock.Random.url(), // banner的跳转链接地址
  bannerList: bannerList // 可用图片列表 列表
}

// 图片列表
for (let i = 0; i < 6; i++) {
  picList.push(Mock.mock({
    id: '@increment',
    picImg: Mock.Random.dataImage('800x200'), // 临时生成图片用，非返回字段
    picUrl: '@url', // 图片url
    picStatus: Mock.Random.boolean(1, 2), // 图片状态，启用 禁用 Mock.mock({"boolean|1-2": true})
    picDesc: '@cparagraph(1)' // banner图描述
  }))
}

export default {
  /**
   * 轮播列表
   * 请求参数：page 当前页数，pageSize 每页条数 ，非必填
   * post 请求
   */
  getBannerList: config => {
    const result = {
      code: '000000',
      count: List.length * 5,
      data: List,
      msg: '获取图片列表成功'
    }
    return result
  },
  /**
   * 根据bannerid获取banner详细信息
   * 请求参数：bannerId banner的id
   * post 请求
   */
  showBannerById: config => {
    const result = {
      code: '000000',
      data: bannerMsg,
      msg: '获取图片列表成功'
    }
    return result
  },
  /**
   * 图片管理列表
   * 请求参数：page 和 pageSize
   * post 请求
   * url /crm/bannerPic/showPicture
   * {"msg":"操作成功","code":"000000","data":[{"id":1,"picUrl":"banner/4c63516f-1a36-4b6a-9ccb-36bb7480fbce.png","picStatus":0,"picDesc":"正式版banner1"},{"id":2,"picUrl":"banner/734c511b-d827-45bf-a167-975dfe9fd5a9.png","picStatus":0,"picDesc":"正式环境banner2"}],"count":2}
   */
  showPicture: config => {
    const result = {
      code: '000000',
      count: picList.length * 5,
      data: picList,
      msg: '获取图片列表成功'
    }
    return result
  }
}
