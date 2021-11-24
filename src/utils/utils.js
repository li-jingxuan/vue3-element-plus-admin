
/** 通用工具类 */

/**
 * 获取变量类型（比typeof更加准确，能够区分 Array | Object 等特殊对象）
 * @param {String} val
 * @returns 类型
 */
export function getTypeof(val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

/**
 * 自定义格式化日期
 * @param {Date String} date[必须] Date() 对象 或 日期字符串
 * @param {String} format[可选] （默认值：dd/MM/yyyy hh:mm:ss）支持 yyyy-MM-dd hh:mm:ss等常用日期格式
 * @returns
 */
 export function formatDate(dt, fmt="dd/MM/yyyy hh:mm:ss") { // author: meizz
  if(!dt) {
    return ''
  }
  if(getTypeof(dt) === 'String') {
    dt = new Date(dt)
  }

  const o = {
    "M+": dt.getMonth() + 1,                 // 月份
    "d+": dt.getDate(),                    // 日
    "h+": dt.getHours(),                   // 小时
    "m+": dt.getMinutes(),                 // 分
    "s+": dt.getSeconds(),                 // 秒
    "q+": Math.floor((dt.getMonth() + 3) / 3), // 季度
    "S": dt.getMilliseconds()             // 毫秒
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (const k in o)
      if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
/**
 * 计算日期时间 date2 - date1
 * @param {Date} minDate
 * @param {Date} maxDate
 * @returns { "day": 47, "hour": 23, "minute": 39, "second": 35, "ms": 572 }
 */
export function computeDate(minDate, maxDate) {
  const difference = maxDate - minDate
  const diffDay = Math.floor(difference / 86400000)
  const _v1 = difference - (diffDay * 86400000)
  const diffHour = Math.floor(_v1 / 3600000)
  const _v2 = _v1 - (diffHour * 3600000)
  const diffMinute = Math.floor(_v2 / 60000)
  const _v3 = _v2 - (diffMinute * 60000)
  const diffSecond = Math.floor(_v3 / 1000)
  const diffMs = _v3 - (diffSecond * 1000)

  return {
    day: diffDay,
    hour: diffHour,
    minute: diffMinute,
    second: diffSecond,
    ms: diffMs
  }
}

/**
 * 遍历对象
 * @param {Object} obj[必须] 需要遍历的对象
 * @param {*} callback[必须] 回调函数，参数 1：key值 参数 2：key对于的值
 */
export function forEachValue(obj, callback) {
  Object.keys(obj).forEach(k => callback(k, obj[k]))
}

export function validateAsync(form, options) {
  return new Promise((resolve, reject) => {
    form.validate(valid => valid ? resolve(options) : reject(valid))
  })
}

export function validateFieldAsync(form, key, options) {
  return new Promise((resolve, reject) => {
    form.validateField(key, valid => valid ? reject(valid) : resolve(options))
  })
}

/**
 * 字符串打马赛克，如：9991234000返回999****000
 * @param {String} str 字符串
 * @param {String} mosStr 马赛克符号
 * @returns {String}
 */
export function addMosaic(str, mosStr = '*') {
  if (!str) {
    return
  }
  const len = str.length
  const baseMos = mosStr.repeat(4)
  if (len < 4) {
    return baseMos
  }
  const half = Math.floor(len / 2)
  const halfL = half - 2
  const halfR = half + 2
  return `${str.slice(0, halfL)}${baseMos}${str.slice(halfR, len)}`
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 格式化价格 1000 => $1,000
 * @param {Number} price 价格
 * @param {String} currencyUnit 货币单位
 * @returns
 */
 export const formatPrice = (price, reservedDigits = 0) => {
  if (!price) {
    return price === 0 ? price : '-'
  }

  const psplit = price.toString().split('.')
  let _p = psplit[0].replace(/(\d{1,3})(?=(\d{3})+$)/g, '$&,')
  if(psplit.length > 1) {
    const floatStr = psplit[1]
    if(floatStr.length > 0) {
      _p += `.${floatStr}`
    }
    const _l = reservedDigits - floatStr.length
    if(_l > 0) {
      _p = `${_p}${'0'.repeat(_l)}`
    }
  } else if(reservedDigits > 0){
    _p = `${_p}.${'0'.repeat(reservedDigits)}`
  }

  return _p
}

/**
 * 计算价格折扣
 * @param {Number} salePrice 购买价
 * @param {Number} delPrice 原价
 * @param {String} currencyUnit 货币单位
 * @returns
 */
export const discountPrice = (salePrice, delPrice) => {
  const _discount = (delPrice - salePrice) / delPrice

  if (_discount < 0.2) {
    return formatPrice(delPrice - salePrice)
  }

  return `${Math.round(_discount * 100)}%`
}

/**
 * 节流函数
 * @param {*} fn 回调
 * @param {*} delay 执行间隔时间 ms
 * @returns
 */
export const throttle = function (fn, delay = 15) {
  let timer = null

  return function () {
    if (!timer) {
      const context = this
      const args = arguments

      timer = setTimeout(() => {
        fn.apply(context, args)

        timer = null
      }, delay)
    }
  }
}

/**
 * 防抖函数
 * @param {*} fn 回调
 * @param {*} delay 等待执行间隔时间 ms
 * @returns
*/
export const debounce = function (fn, delay = 15) {
  let timer = null

  return function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    const ctx = this
    const args = arguments
    timer = setTimeout(() => {
      fn.apply(ctx, args)
    }, delay)
  }
}

export const getDefaultAvatar = (firstLetter) => {
  const letters = [
    'A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', 'G', 'H', 'I', 'J', 'K', 'L', '7', '8', '9', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ]
  const index = letters.indexOf(firstLetter)
  if (index < 0) {
    return 'ic_avatar_red'
  } else if (index <= 5) {
    // 0-5
    return 'ic_avatar_blue'
  } else if (index <= 11) {
    // 6-11
    return 'ic_avatar_orange'
  } else if (index <= 17) {
    // 12-17
    return 'ic_avatar_pink'
  } else if (index <= 23) {
    // 18-23
    return 'ic_avatar_red'
  } else if (index <= 29) {
    // 24-28
    return 'ic_avatar_violet'
  } else {
    // 30-35
    return 'ic_avatar_cyan'
  }
}

/**
 * 合并props、props转换成模板属性
 * @param {Object} props Vue.props 属性对象
 * @param {Object} customProps 需要合并到 Vue.props 的对象
 * @returns {Object} { newProps: {}, attrStr: ':propsA="propsA" \n :propsB="propsB"' }
 */
export function assignAndToAttrStrByProps(props, customProps = {}) {
  if (!props) {
    return
  }

  const _props = assignObject(props, customProps)
  const attrStr = formatPropsToAttrStr(props)

  return {
    props: _props,
    attrStr
  }
}

/**
 * 合并两个对象
 * @param {Object} obj 目标对象
 * @param {Object} customObject 需要合并到 目标对象 的对象
 * @returns Object.assign(props, customProps)
 */
export function assignObject(obj, customObject) {
  if (!obj || !customObject) {
    return obj
  }
  return Object.assign({}, obj, customObject)
}

/**
 * 将props属性格式化成模板属性字符串格式
 * @param {Object} props
 * @returns 属性模板字符串: `:propsName="propsName"`
 */
export function formatPropsToAttrStr(props) {
  if (!props) {
    return
  }
  return Object.keys(props).map(k => `:${k}="${k}"`).join('\n')
}
