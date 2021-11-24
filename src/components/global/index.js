/**
 * 注册全局组件
 * 排除已 Base 开头的.vue文件，认为 Base 开头的组件为父组件，不进行全局注册
 */

const content = require.context('./', true, /\.vue$/)

export default function(app) {
  content.keys().forEach(k => {
    const _c = content(k).default

    if (!/^Base/.test(_c.name)) {
      app.component(_c.name, _c)
    }
  })
}
