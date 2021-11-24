// i18n Plugins
import { createI18n } from 'vue-i18n'
import lang from '@/lang'

// ElementPlus Plugins
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import localeZH from 'element-plus/lib/locale/lang/zh-cn'
import localeEN from 'element-plus/lib/locale/lang/en'

// store.js Plugins
import browserStore from './browser-store'
import store from '@/store'

// EventEmitter Plugins
import { Emitter } from './event-emitter'

// 气泡消息插件
import { Message } from './messager.js'

const _i18n = createI18n({
  locale: store.state.localLanguages,
  fallbackLocale: localeEN.name,
  messages: {
    [localeZH.name]: {
      el: localeZH.el,
      ...lang[localeZH.name]
    },
    [localeEN.name]: {
      el: localeEN.el,
      ...lang[localeEN.name]
    }
  }
})
export const i18n = _i18n.global
export default (app) => {
  app.use(_i18n)
  app.use(ElementPlus, { i18n: _i18n.global.t })
  app.use(browserStore)
  app.use(Emitter)
  app.use(Message)
}
