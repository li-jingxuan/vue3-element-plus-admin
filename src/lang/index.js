const langFiles = require.context('./', true, /\.js$/)

// 采用 “策略模式" 动态注册国际化文件
const i18nObject = {}
const settingLang = {
  _set: {
    en: function(key, lang) {
      const _k = 'en'
      const paths = key.replace(/.\/en\//g, '').replace(/\.js$/g, '').split('/')

      if (!i18nObject[_k]) {
        i18nObject[_k] = {}
      }

      this._set(_k, paths, lang)
    },
    'zh-cn': function(key, lang) {
      const _k = 'zh-cn'
      const paths = key.replace(/.\/zh-cn\//g, '').replace(/\.js$/g, '').split('/')

      if (!i18nObject[_k]) {
        i18nObject[_k] = {}
      }

      this._set(_k, paths, lang)
    },
    _getCurChildren(path, o) {
      path = path.split('-').map((_v, index) => index === 0 ? _v : _v.replace(/^\S/, s => s.toUpperCase())).join('')
      if (!o[path]) {
        o[path] = {}
      }

      return o[path]
    },
    _set(key, paths, value) {
      let t = i18nObject[key]

      for (let i = 0; i < paths.length; i++) {
        const k = paths[i]
        t = this._getCurChildren(k, t)
        if (i >= paths.length - 1) {
          Object.assign(t, value)
        }
      }
    }
  },
  setting: function(type, key, lang) {
    this._set[type] && this._set[type](key, lang)
  }
}

langFiles.keys().filter(c => c !== './index.js').forEach(key => {
  const moduleValue = langFiles(key)
  const _c = key.match(/\/(zh-cn|en)\//g)

  if (_c && _c.length > 0) {
    // replaceAll() 此方法兼容性存在问题
    settingLang.setting(_c[0].replace(/\//g, ''), key, moduleValue.default)
  }
})

export default i18nObject
