/**
 * 注册全局组件
 * 排除已 Base 开头的.vue文件，认为 Base 开头的组件为父组件，不进行全局注册
 */
// 按需引入树形表格相关控件
import { Header, Column, Table, Grid, Icon } from 'vxe-table'
const content = require.context('./', true, /\.vue$/)

export default function(app) {
  content.keys().forEach(k => {
    const _c = content(k).default

    if (!/^Base/.test(_c.name)) {
      app.component(_c.name, _c)
    }
  })

  // 这是 虚拟表（解决大表格渲染性能问题）
  app
    .use(Header)
    .use(Grid)
    .use(Column)
    .use(Table)
    .use(Icon)
}
