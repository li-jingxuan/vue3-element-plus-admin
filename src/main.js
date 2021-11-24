import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installPlugins from '@/utils/plugins'
import './assets/css/icon.css'
import '@/lang'
import './assets/css/custom-element-plus.scss'
import './assets/css/fonts/iconfont.css'
import useGlobalComponents from './components/global'

// 按需引入树形表格相关控件
import { Header, Column, Table, Grid, Icon } from 'vxe-table'

const app = createApp(App)

// 注册全局组件
useGlobalComponents(app)
installPlugins(app)

app
  .use(store)
  .use(router.router)
  .use(Header)
  .use(Grid)
  .use(Column)
  .use(Table)
  .use(Icon)
  .mount('#app')
