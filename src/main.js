import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installPlugins from '@/utils/plugins'
import './assets/css/icon.css'
import '@/lang'

const app = createApp(App)

// 安装插件（Element、I18n等）
installPlugins(app)
app
  .use(store)
  .use(router.router)
  .mount('#app')
