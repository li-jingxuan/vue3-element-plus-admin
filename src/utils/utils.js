
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
 * @param {Date String} date Date() 对象 或 日期字符串
 * @param {String} format 支持 YYYY-MM-DD HH:mm:ss / YY-MM-DD / HH:mm:ss / YYYYMMDD 等常用日期格式
 * @returns
 */
export function formatDate(date, format) {
  let dt = date
  if (getTypeof(date) === 'String') {
    dt = new Date(date)
  }
  const reg = {
    'Y+': dt.getFullYear(),
    'M+': dt.getMonth() + 1,
    'D+': dt.getDate(),
    'H+': dt.getHours(),
    'm+': dt.getMinutes(),
    's+': dt.getSeconds()
  }
  const formatDt = []
  const formatPipe = format.match(/[^YMDHms]/g)
  let i = -1
  for (const key in reg) {
    i++
    const curPipe = !formatPipe ? '' : formatPipe[i] || ''
    const regEx = new RegExp(key)
    const _c = format.match(regEx)
    if (!_c) {
      break
    }
    const _clen = _c[0].length
    const _val = reg[key]

    if (key === 'Y+' && _clen < 4) {
      formatDt[i] = _val.toString().slice((4 - _clen), _clen) + curPipe
    } else {
      if (_val < 10 && _c[0].length > 1) {
        formatDt[i] = `${0}${_val}${curPipe}`
      } else {
        formatDt[i] = `${_val}${curPipe}`
      }
    }
  }

  return formatDt.join('')
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
