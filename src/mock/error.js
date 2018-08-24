const success = {
  msg: '收集日志成功',
  data: {},
  code: '10000'
}
export default {
  errorSend: config => {
    // const { username } = JSON.parse(config.body)
    return success
  }
}
