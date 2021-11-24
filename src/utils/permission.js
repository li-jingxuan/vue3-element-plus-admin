import store from '@/store'

/**
 * 获取当前页面权限
 * @param {Object} route
 * @returns Boolean
 */
export const isPermission = (route, from, next) => {
  const { userInfo } = store.state

  // 如果权限配置为 all，那么不需要登录也能够进入查看
  if (route.meta.permission === 'all') {
    next()
    return
  }
  // 没有登录
  if (!userInfo || !userInfo.permission) {
    next('/login')
    return
  }

  // 当前页面没有配置权限
  if (!route.meta || !route.meta.permission) {
    next()
    return
  }

  const systemPermission = userInfo.permission.codePaths || []

  systemPermission.includes(route.meta.permission) ? next() : next('/403')
}
