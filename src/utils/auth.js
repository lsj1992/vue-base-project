import Cookies from 'js-cookie'

const TokenKey = 'token'
const userMsgKey = 'userMsg'

const cstfToken = 'csrfToken'
Cookies.set('test1', 'test1')
Cookies.set('test2', 'test2')
Cookies.set('test3', 'test3')

export function getCsrfToken() {
  return Cookies.get(cstfToken)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getUserMsg() {
  const userMsg = Cookies.get(userMsgKey)
  if (userMsg) {
    return JSON.parse(userMsg)
  } else {
    return {}
  }
}
export function setUserMsg(userMsg) {
  return Cookies.set(userMsgKey, JSON.stringify(userMsg))
}
export function removeUserMsg() {
  return Cookies.remove(userMsgKey)
}

