import request from '../utils/request'

// 获取后台管理账号列表
export const getManageAccount = (params) => request.get('https://apis.perfee.net/mock/629/product-line-admin/accounts', { params: params }).then(res => res.data)

// 创建管理员账号
export const addManageAccount = (params) => request.post('https://apis.perfee.net/mock/629/product-line-admin/account', params).then(res => res.data)

// 修改管理员账号
export const editManageAccount = (params) => request.patch('https://apis.perfee.net/mock/629/product-line-admin/account', params).then(res => res.data)

// 获取权限code
export const getCodePath = () => request.get('https://apis.perfee.net/mock/629/product-line-admin/permission/code-path').then(res => res.data)

// 查询账号管理权限
export const getPermissions = (params) => request.get('https://apis.perfee.net/mock/629/product-line-admin/permissions', params).then(res => res.data)

// 修改管理账号权限
export const editPermission = (params) => request.put('https://apis.perfee.net/mock/629/product-line-admin/permissions', { params: params }).then(res => res.data)
