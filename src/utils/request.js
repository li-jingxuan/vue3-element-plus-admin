import axios from 'axios'
import store from '@/store'
import $route from '@/router'

// axios docs: https://axios-http.com/docs/zh/cancellation/
const env = process.env.VUE_APP_ENV || 'dev'

// 接口环境
const baseUrlObj = {
  dev: '/api',
  test: '/test',
  prod: '/prod',
  build: '/api'
}
const service = axios.create({
  baseURL: baseUrlObj[env],
  timeout: 15000
})

// TODO 这里没有解决 请求覆盖 的问题，后面需要进行处理
service.interceptors.request.use(
  (config) => {
    const userInfo = store.state.userInfo
    const defaultHeaders = {
      'PL-Token': userInfo && userInfo.token ? userInfo.token : ''
    }
    // 合并
    config.headers = Object.assign(config.headers, defaultHeaders)

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  async(response) => {
    const lastPermission = store.state.PLPermission
    const curPermission = response.headers['pl-permission-digest']
    // 可以通过头信息 来确认是否需要更新权限
    if (curPermission) {
      if (!lastPermission) {
        store.commit('setPLPermission', curPermission)
      } else {
        if (curPermission !== lastPermission) {
          await store.dispatch('updateUserRoleAction')
          store.commit('setPLPermission', curPermission)
        }
      }
    }
    // http success code: 200 304
    // system success code: 0
    const code = response.data.code
    const emtyErr = {}
    if ([200, 304].includes(response.status) && code === 0) {
      return Promise.resolve(response.data)
    } else if (code === 3000) {
      // 登录过期
      $route.router.replace({ path: '/login' })

      console.error(response.data)
      return Promise.reject(emtyErr)
    } else if (code === 1001) {
      $route.router.push({ path: '/403' })

      console.error(response.data)
      return Promise.reject(emtyErr)
    } else {
      return Promise.reject(response.data)
    }
  },
  (error) => {
    console.error(error)
    const msg = '请求超时，请重试'
    let err = { msg }
    if (!error.response) {
      return Promise.reject(err)
    }
    // 将错误消息体返回掉
    const code = error.response.data.code
    err = error.response.data
    if (code === 3000) {
      // 登录过期
      $route.router.replace({ path: '/login' })
      err = {}
    } else if (code === 1001) {
      $route.router.push({ path: '/403' })
      err = {}
    }
    return Promise.reject(err || {})
  }
)

export default service
