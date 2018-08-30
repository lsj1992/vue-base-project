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
 * 获取图片列表
 * /crm/bannerPic/showPicture
 */
export function showPicture(isCodeTable, data) {
  return request({
    url: '/crm/bannerPic/showPicture',
    method: 'post',
    data
  })
}
/**
 * 添加banner
 *
 */
export function insertBanner(data) {
  return request({
    url: '/crm/banner/insertBanner',
    method: 'post',
    data
  })
}
