import { sendErrorMsg } from '@/api/error'
const errorLog = {
  state: {
    logs: []
  },
  mutations: {
    ADD_ERROR_LOG: (state, log) => {
      state.logs.push(log)
    }
  },
  actions: {
    addErrorLog({ commit }, log) {
      return new Promise((resolve, reject) => {
        sendErrorMsg(log).then(function(res) {
          console.log(res)
          commit('ADD_ERROR_LOG', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default errorLog
