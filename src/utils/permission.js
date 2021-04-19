import store from '@/store'

/**
 * 获取当前页面权限
 * @param {Object} route
 * @returns Boolean
 */
export const isPermission = (route) => {
  if (!route.meta || !route.meta.permission) {
    return true
  }

  const systemPermission = store.state.systemPermission

  return systemPermission.includes(route.meta.permission)
}
