import Mock from 'mockjs'
import loginAPI from './login'
import errorApi from './error'
import gzbCodeTable from './gzbCodeTable'
import gzbBanner from './gzbBanner'

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)
// 收集错误信息
Mock.mock(/\/logApi\/webLogs\.*/, 'get', errorApi.errorSend)

// 工之保

// 获取码值 列表 注意这个接口必须写在下面 queryConfig 之前要，两个接口都会被 queryConfig 匹配到
Mock.mock(/\/crm\/configCode\/queryConfigCodeList/, 'post', gzbCodeTable.getCodeValueList)

// 根据码值id删除码值
Mock.mock(/\/crm\/configCode\/deleteCode/, 'post', gzbCodeTable.delCodeValueById)

// 获取码表 列表
Mock.mock(/\/crm\/configCode\/queryConfig/, 'post', gzbCodeTable.getConfigCode)
// 根据码表id删除码表
Mock.mock(/\/crm\/configCode\/deleteConfig/, 'post', gzbCodeTable.delCodeTableById)

// 增加码表
Mock.mock(/\/crm\/configCode\/addConfig/, 'post', gzbCodeTable.addCodeTable)
// 增加码值
Mock.mock(/\/crm\/configCode\/addCode/, 'post', gzbCodeTable.addCodeValue)

// 根据id获取到banner信息【注意和下面获取banner列表的顺序不能换】
Mock.mock(/\/crm\/banner\/showBannerById/, 'post', gzbBanner.showBannerById)
// 获取banner列表
Mock.mock(/\/crm\/banner\/showBanner/, 'post', gzbBanner.getBannerList)

export default Mock
