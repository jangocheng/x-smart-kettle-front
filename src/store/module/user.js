import {
  login,
  logout,
  getUserInfo,
  getThirdToken
} from '@/api/user'
import { TOKEN_KEY,THIRD_TOKEN_KEY,setToken, getToken } from '@/libs/platformUtil'
import Vue from 'vue'
import { getPermission } from '@/api/app'
export default {
  state: {
    userName: '',
    avatarImgPath: '',
    token: getToken(),
    unreadCount: 0,
    // thirdToken: getToken(),
    hasGetInfo: false,
  },
  getters:{
    getToken: state => state.token
  },
  mutations: {
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserName (state, name) {
      state.userName = name
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    // setThirdToken (state, token) {
    //   state.thirdToken = token
    //   setToken(THIRD_TOKEN_KEY,token)
    // }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password,verification }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password,
          verification
        }).then(res => {
          const result = res.data
          if (result && result.code === 1) {
            commit('setToken',result.data.token)
            commit('setTagNavList', [])
             resolve()
          } else {
            reject(new Error(result.msg))
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setUserName', '')
          // commit('setThirdToken', '')
          //刷新浏览器，清空动态路由
          setTimeout(() => {
            window.location.reload()
          },0)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo({state, commit}) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const result = res.data;
          if (result && result.code === 1) {
             commit('setAvatar', result.data.avatar)
            commit('setUserName', result.data.userName)
            resolve(result.data)
          } else {
            reject(new Error(result.msg))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取第三方集成token
    getThirdToken({state, commit}) {
      return new Promise((resolve, reject) => {
        getThirdToken().then(res => {
          let result = res.data;
          if (result && result.code === 1) {
            commit('setThirdToken', result.data)
            resolve(result.data)
          } else {
            reject(new Error(result.msg))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    getPermissionData({commit}) {
      return new Promise((resolve, reject) => {
        getPermission().then(({data: result}) => {
          if (result && result.code === 1 && result.data) {
            let permission = {}
            for (const item of result.data) {
              if (item.permissionValue) {
                permission[item.permissionValue] = true
              }
            }
            commit('setPermission', permission)
            resolve(result.data)
          } else {
            reject(new Error(result.msg))
          }
        }).catch((e) => {
          reject(e)
        })
      })
    }
  },

}
