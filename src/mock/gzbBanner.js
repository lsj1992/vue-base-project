// http://192.168.3.131:8080/crm/banner/showBanner

/**
 * 工之保 图片管理 模拟数据
 */
import Mock from 'mockjs'
const count = 10
const List = []
let bannerMsg = {}
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

bannerMsg = {
  id: Mock.Random.increment(), // Banner 的id
  bannerIndex: Mock.Random.integer(0, 3), // 序号
  bannerPicId: Mock.Random.integer(60, 100), // 图片url
  bannerDesc: Mock.Random.cparagraph(1), // banner的描述
  bannerType: Mock.Random.integer(0, 3), // banner的类型
  bannerUrl: '@url' // banner的跳转链接地址
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
  }
}
