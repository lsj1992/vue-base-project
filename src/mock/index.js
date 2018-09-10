import Mock from 'mockjs'
import loginAPI from './login'
import errorApi from './error'

// 登录相关
Mock.mock(/\/crm\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/crm\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)
// 收集错误信息
Mock.mock(/\/logApi\/webLogs\.*/, 'get', errorApi.errorSend)

export default Mock
