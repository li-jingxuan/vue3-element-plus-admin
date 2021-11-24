/** 常用校验规则 */

/**
 * 是否为数字（正负小数或正负整数）
 * @param {any} val
 * @returns Boolean
 */
export const isNumber = (val) => {
  return /^[+-]?\d+$/.test(val) || /^[-+]?\d+\.?\d+$/.test(val)
}

/**
 * 正整数
 * @param {any} val
 * @returns Boolean
 */
export const isPositiveInteger = (val) => /^\d+$/g.test(val)

/**
 * 负整数
 * @param {any} val
 * @returns Boolean
 */
export const isNegativeInterger = (val) => /^-\d+$/.test(val)

/**
 * 正负小数（带一个小数点）
 * @param {any} val
 * @returns Boolean
*/
export const isFloat = (val) => /^[+-]?\d+\.\d+$/.test(val)

/**
 * 小数（带一个小数点）
 * @param {any} val
 * @returns Boolean
*/
export const isPositiveFloat = (val) => /^[+]?\d+\.\d+$/.test(val)

/**
 * 负小数（带一个小数点）
 * @param {any} val
 * @returns Boolean
*/
export const isNegativeFloat = (val) => /^[-]\d+\.\d+$/.test(val)

/**
 * 邮箱校验
 * @param {any} val
 * @returns Boolean
*/
export const isEmail = (val) => /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(val)

/**
 * 验证一个字符串是否符合长度
 * @param {String} val 字符串
 * @param {Number} minLen 最小长度
 * @param {Number} maxLen 最大长度
 * @returns Boolean
 */
export const isMaxLen = (val, minLen, maxLen) => val.length > minLen && val.length < maxLen

/**
 * 匹配特殊字符串，返回匹配结果，包含 index 索引位置
 * @param {String} val
 * @returns Object { 0: "/", groups: undefined, index: 2, input: "we/rwqe###sef%$@#" }
 */
export const isSpecialChar = (val) => /[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/img.exec(val)
