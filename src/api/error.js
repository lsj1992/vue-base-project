import request from '@/utils/request'

export function sendErrorMsg(params) {
  return request({
    url: '/logApi/webLogs',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
