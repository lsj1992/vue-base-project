/**
 *  工之保获取banner列表接口
 */
import request from '@/utils/request'
/**
 * 获取banner列表
 * /crm/banner/showBanner
 */
export function getBannerList(data) {
  return request({
    url: '/crm/banner/showBanner',
    method: 'post',
    data
  })
}
/**
 * 根据bannerId查看banner具体信息
 * /crm/banner/showBannerById
 */
export function showBannerById(data) {
  return request({
    url: '/crm/banner/showBannerById',
    method: 'post',
    data
  })
}
/**
 * 更新banner数据 后期可以将筛选图片加进去
 *
 */
export function updateBanner(data) {
  return request({
    url: '/crm/banner/updateBanner',
    method: 'post',
    data
  })
}
/**
 * 删除banner数据
 *
 */
export function deleteBanner(data) {
  return request({
    url: '/crm/banner/deleteBanner',
    method: 'post',
    data
  })
}
/**
 * 获取图片列表
 * /crm/bannerPic/showPicture
 */
export function showPicture(data) {
  return request({
    url: '/crm/bannerPic/showPicture',
    method: 'post',
    data
  })
}
/**
 * 获取图片列表2 过滤了 禁用状态的图片
 * /crm/bannerPic/showEnabledPicture
 */
export function showEnabledPicture(data) {
  return request({
    url: '/crm/bannerPic/showEnabledPicture',
    method: 'post',
    data
  })
}
/**
 * 添加图片
 *
 */
export function insertBanner(data) {
  return request({
    url: '/crm/banner/insertBanner',
    method: 'post',
    data
  })
}
/**
 * 更新图片状态 启用禁用
 *
 */
export function updatePicture(data) {
  return request({
    url: '/crm/bannerPic/updatePicture',
    method: 'post',
    data
  })
}
