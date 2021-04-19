import axios from 'axios'

// axios docs: https://axios-http.com/docs/zh/cancellation/

const service = axios.create({
  baseURL: '/api',
  // headers: { 'X-Custom-Header': 'foobar' },
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    // 这里等后端部署完成后需要配置一些必要的 headers
    // config.headers = {}
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    console.log(response)
    // http success code: 200 304
    // system success code: 0
    if (response.status === 200 && response.data.code === 0) {
      return response.data
    } else {
      return Promise.reject(response.data)
    }
  },
  error => {
    console.error(error)
    // 将错误消息体返回掉
    return Promise.reject(error.response)
  }
)

export default service
