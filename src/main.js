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

const app = createApp(App)

// 注册全局组件
useGlobalComponents(app)
installPlugins(app)

app
  .use(store)
  .use(router.router)
  .mount('#app')
