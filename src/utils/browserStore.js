// store.js
// github docs: https://github.com/marcuswestin/store.js#user-content-using-plugins
import engine from 'store/src/store-engine'
const storages = [
  require('store/storages/localStorage'),
  require('store/storages/cookieStorage')
]
const plugins = [
  require('store/plugins/defaults'),
  require('store/plugins/expire')
]
export const store = engine.createStore(storages, plugins)

export default {
  install: (app) => {
    app.config.globalProperties.$browserStore = store
  }
}
