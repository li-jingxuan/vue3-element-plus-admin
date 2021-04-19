import { createStore } from 'vuex'
import ModuleA from './modules/home'
import { store } from '@/utils/browserStore'
console.log(store.get('local-languages'))
export default createStore({
  // 业务模块全局状态管理
  modules: {
    a: ModuleA
  },
  // -------- 系统全局状态管理 --------
  state: {
    tagsList: [],
    collapse: false,
    // 系统权限管理
    systemPermission: [],
    // 当前语言包
    localLanguages: store.get('local-languages') || 'zh-cn',
    // 当前后台主题
    headerTheme: store.get('data-header-theme') || 'black',
    sidebarTheme: store.get('data-sidebar-theme') || 'black'
  },
  mutations: {
    setTheme (state, { key, val }) {
      state[`${key}Theme`] = val

      const themeKey = `data-${key}-theme`
      console.log(themeKey, val)
      store.set(themeKey, val)
    },
    setLocalLanguages (state, local) {
      state.localLanguages = local

      store.set('local-languages', local)
    },
    delTagsItem (state, data) {
      state
        .tagsList
        .splice(data.index, 1)
    },
    setTagsItem (state, data) {
      state
        .tagsList
        .push(data)
    },
    clearTags (state) {
      state.tagsList = []
    },
    closeTagsOther (state, data) {
      state.tagsList = data
    },
    closeCurrentTag (state, data) {
      for (let i = 0, len = state.tagsList.length; i < len; i++) {
        const item = state.tagsList[i]
        if (item.path === data.$route.fullPath) {
          if (i < len - 1) {
            data
              .$router
              .push(state.tagsList[i + 1].path)
          } else if (i > 0) {
            data
              .$router
              .push(state.tagsList[i - 1].path)
          } else {
            data
              .$router
              .push('/')
          }
          state
            .tagsList
            .splice(i, 1)
          break
        }
      }
    },
    // 侧边栏折叠
    hadndleCollapse (state, data) {
      state.collapse = data
    }
  }
  // -------- 系统全局状态管理 --------
})
