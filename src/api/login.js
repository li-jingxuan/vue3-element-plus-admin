import request from '../utils/request'

// 登录
export const login = (params) => request.post('https://apis.perfee.net/mock/629/product-line-admin/login', params).then(res => res.data)

// 获取用户信息
// export const getUserInfo = () => request.get('https://apis.perfee.net/mock/629/me/info').then(res => res.data)
