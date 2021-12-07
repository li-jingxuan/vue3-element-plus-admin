import { createStore } from 'vuex'
import { browserStore } from '@/utils/browser-store'
import { login } from '@/api/login'
import { getCodePath } from '@/api/permissions'
import { useEmitter } from '@/utils/event-emitter'
const $emitter = useEmitter()

export default createStore({
  // 业务模块全局状态管理
  modules: {},
  // -------- 系统全局状态管理 --------
  state: {
    tagsList: [],
    collapse: false,
    // 当前语言包
    localLanguages: browserStore.get('local-languages') || 'zh-cn',
    // 当前后台主题
    headerTheme: browserStore.get('data-header-theme') || 'white',
    sidebarTheme: browserStore.get('data-sidebar-theme') || 'black',
    userInfo: browserStore.get('user-info') || null,
    // 存储权限比对的 key 值
    PLPermission: browserStore.get('pl-permission-digest') || ''
  },
  getters: {
    sysCurrency: state => (state.userInfo || {}).currency || {}
  },
  mutations: {
    setTheme(state, { key, val }) {
      state[`${key}Theme`] = val
      const themeKey = `data-${key}-theme`

      browserStore.set(themeKey, val)
    },
    setLocalLanguages(state, local) {
      state.localLanguages = local

      browserStore.set('local-languages', local)
    },
    delTagsItem(state, data) {
      state.tagsList.splice(data.index, 1)
    },
    setTagsItem(state, data) {
      state.tagsList.push(data)
    },
    clearTags(state) {
      state.tagsList.splice(0, state.tagsList.length)
    },
    closeCurrentTag(state, data) {
      for (let i = 0, len = state.tagsList.length; i < len; i++) {
        const item = state.tagsList[i]
        if (item.path === data.$route.fullPath) {
          if (data.path) {
            data.$router.push(data.path)
          } else {
            if (i < len - 1) {
              data.$router.push(state.tagsList[i + 1].path)
            } else if (i > 0) {
              data.$router.push(state.tagsList[i - 1].path)
            } else {
              data.$router.push('/')
            }
          }
          state.tagsList.splice(i, 1)
          break
        }
      }
    },
    // 侧边栏折叠
    hadndleCollapse(state, data) {
      state.collapse = data
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      // 用户信息默认 7 天过期
      browserStore.set('user-info', userInfo, new Date().getTime() + 604800000)
    },
    logout(state) {
      state.userInfo = null
      browserStore.remove('user-info')
    },
    setPLPermission(state, PLPermission) {
      state.PLPermission = PLPermission
      browserStore.set('pl-permission-digest', PLPermission, new Date().getTime() + 604800000)
    }
  },
  actions: {
    // 登录
    async loginAction({ commit }, loginParams) {
      // 登录 Action
      // const loginInfo = await login(loginParams)
      // 测试数据
      const loginInfo = {
        token: 'TOKEN-DATA-20211207-TOKEN-DATA',
        username: 'Tom',
        // 权限控制
        permission: {
          codePaths: [],
          digest: 'ALL'
        }
      }
      // 要先写入 token，才能获取用户信息
      commit('setUserInfo', loginInfo)

      // 获取用户信息
      // const userInfo = await getUserInfo()
      // loginInfo.userInfo = userInfo
      // commit('setUserInfo', loginInfo)
    },
    async updateUserRoleAction({ commit, state }) {
      const userInfo = state.userInfo

      // const userRole = await getCodePath()
      userInfo.permission = {
        codePaths: [],
        digest: 'ALL'
      } // userRole

      $emitter.emit('update:role')
      commit('setUserInfo', userInfo)
    }
  }
  // -------- 系统全局状态管理 --------
})
