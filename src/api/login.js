import request from '@/utils/request'

export function loginByUsername(name, password) {
  const data = {
    name,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
/**
 *  获取验证码
 */
export function getCaptcha() {
  return request({
    url: '/api/login/captcha',
    method: 'get'
  })
}

