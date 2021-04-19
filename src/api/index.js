import request from '../utils/request'

export const fetchData = () => {
  return request({
    url: '/login',
    method: 'get',
    params: {
      account: 'YIFEI',
      captcha: 'mdbh',
      captchaSn: '2439cb57-9dcb-11eb-9393-0255ac100076',
      loginType: 1,
      password: 'perfee123'
    }
  })
}
