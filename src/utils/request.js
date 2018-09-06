import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import qs from 'Qs'
// import { getToken, getCsrfToken } from '@/utils/auth'

// axios.defaults.transformRequest = [function(data) {
// }]

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000, // request timeout
  withCredentials: false // 允许携带cookie
})
// function csrfSafeMethod(method) {
//   // these HTTP methods do not require CSRF protection
//   return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method))
// }
// service.defaults.headers['crossDomain'] = true
// service.defaults.headers['Content-Type'] = 'application/json'
// service.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// service.defaults.headers['Access-Control-Allow-Origin'] = 'http://192.168.3.114:8080'

service.interceptors.request.use(config => {
  const token = store.getters.token
  // config.headers['x-csrf-token'] = store.getters.CsrfToken
  // // Do something before request is sent
  // if (!csrfSafeMethod(config.method) && !config.headers['crossDomain']) {
  //   if (store.getters.CsrfToken) {
  //     config.headers['x-csrf-token'] = store.getters.CsrfToken
  //   }
  // }
  // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  // if (store.getters.token !== undefined) {
  //   config.headers['Authorization'] = store.getters.token
  // }
  if (config.method === 'get') {
    config.params = {
      token: token,
      ...config.params
    }
  } else {
    const data = qs.parse(config.data)
    config.data = {
      token: token,
      ...data
    }
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'crossDomain': false
    }
    config.transformRequest = [function(data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret.slice(0, -1)
    }]
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})
// respone interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    if (res.e === '1000015' || res.code === '1000015') {
      Message({
        message: res.m ? res.m : '请先登录！',
        type: 'warning'
      })
      store.dispatch('FedLogOut').then(() => {
        location.reload()
      })
      return Promise.reject('error')
    } else {
      return response
    }
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // 请自行在引入 MessageBox
    //     // import { Message, MessageBox } from 'element-ui'
    //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('FedLogOut').then(() => {
    //         location.reload() // 为了重新实例化vue-router对象 避免bug
    //       })
    //     })
    //   }
    //   return Promise.reject('error')
    // } else {
    //   return response.data
    // }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })
export const http = axios
export default service

