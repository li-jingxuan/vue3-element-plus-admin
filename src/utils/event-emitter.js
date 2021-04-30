class EventEmitter {
  /**
   * 事件总线
   */
  constructor() {
    this.events = {}
  }

  /**
   * 触发
   * @param {String} eventName 事件名称
   * @returns
   */
  emit(eventName) {
    const fns = this.events[eventName]
    if (!fns) {
      return
    }

    const args = [].slice.call(arguments).slice(1, arguments.length)
    fns.forEach(fn => {
      fn.apply(this, args)
    })
  }

  /**
   * 只监听一次
   * @param {String} eventName
   * @param {Function} callback
   */
  once(eventName, callback) {
    function fn() {
      callback.apply(this, arguments)
      this.off(eventName)
    }
    this.on(eventName, fn)
  }

  /**
   * 取消监听
   * @param {String} eventName 事件名称【必须】
   * @param {Funtion} callback 回调函数【可选】，不传入则清除整个eventName的值，传入则清除传入的回调函数监听
   * @returns
   */
  off(eventName, callback) {
    if (!this.events[eventName]) {
      return
    }

    let newEvt = []

    if (callback) {
      newEvt = this.events[eventName].filter(fn => fn !== callback)
    }

    this.events[eventName] = newEvt
  }

  /**
   * 监听
   * @param {String} eventName
   * @param {Funtion} callback
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }

    this.events[eventName].push(callback)
  }

  // 获取实例
  static getInstance = (function() {
    let instance = null
    return function() {
      if (!instance) {
        instance = new EventEmitter()
      }

      return instance
    }
  })()
}

export const useEmitter = EventEmitter.getInstance

export const Emitter = {
  install: (app) => {
    app.config.globalProperties.$bus = useEmitter()
  }
}
