/**
 *  工之保获取banner列表接口
 */
import request from '@/utils/request'

export function getBannerList(isCodeTable, data) {
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
export function showBannerById(isCodeTable, data) {
  return request({
    url: '/crm/banner/showBannerById',
    method: 'post',
    data
  })
}
