import { loginByUsername, logout, getUserInfo } from '@/api/login'
import {
  getCsrfToken,
  getToken,
  setToken,
  removeToken,
  getUserMsg,
  setUserMsg,
  removeUserMsg
} from '@/utils/auth'
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    CsrfToken: getCsrfToken(),
    name: '',
    avatar: '', // 头像
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    // 登录后返回字段
    userMsg: getUserMsg(), // 登录用户全部信息
    token: getToken() // token
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_MSG: (state, userMsg) => {
      state.userMsg = userMsg
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USER_NAME: (state, name) => {
      state.userName = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const name = userInfo.name.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(name, userInfo.password).then(response => {
          const res = response.data
          if (res.e === '000000') {
            commit('SET_TOKEN', res.d.token)
            commit('SET_USER_MSG', res.d)
            setToken(res.d.token)
            setUserMsg(res.d)
            resolve(res.d)
          } else {
            reject(res)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息 用来做权限判断，暂时不需要，
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 临时处理
        commit('SET_ROLES', ['admin'])
        resolve(['admin'])

        // getUserInfo(state.token).then(response => {
        //   if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
        //     reject('error')
        //   }
        //   const data = response.data

        //   if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        //     commit('SET_ROLES', data.roles)
        //   } else {
        //     reject('getInfo: roles must be a non-null array !')
        //   }
        //   commit('SET_AVATAR', data.avatar)
        //   commit('SET_INTRODUCTION', data.introduction)
        //   resolve(response)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeUserMsg()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeUserMsg()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
