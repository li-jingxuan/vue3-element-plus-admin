import { ElMessage, ElLoading } from 'element-plus'

export const fullLoading = (text, spinner, options) => {
  const opt = {
    lock: true,
    text: text || 'Loading',
    spinner: spinner || 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.5)',
    ...options
  }
  return ElLoading.service(opt)
}

export const messageTip = (message, type, options) => {
  const opt = {
    // 默认配置
    // 显示关闭按钮
    showClose: true,
    type,
    ...options
  }
  return ElMessage({ message, type, ...opt })
}

export const messageError = (msg, options) => {
  let message = msg
  if (typeof msg !== 'string') {
    message = msg.msg || msg.message
  }

  return messageTip(message, 'error', options)
}

export const messageSuccess = (msg, options) => {
  return messageTip(msg, 'success', options)
}

export const sysSuccess = () => {
  return messageTip('操作成功', 'success')
}

export const sysError = () => {
  return messageTip('操作失败', 'error')
}

export const enduringMsg = (msg, type) => {
  return messageTip(msg, type, { duration: 0 })
}

const msg = {
  messageTip,
  sysSuccess,
  sysError,
  enduringMsg,
  messageError,
  messageSuccess,
  fullLoading
}

export const useMessage = () => msg

export const Message = {
  install: (app) => {
    app.config.globalProperties.$messageTip = messageTip
    app.config.globalProperties.$messageError = messageError
    app.config.globalProperties.$enduringMsg = enduringMsg
    app.config.globalProperties.$sysSuccess = sysSuccess
    app.config.globalProperties.$sysError = sysError
    app.config.globalProperties.$messageSuccess = messageSuccess
    app.config.globalProperties.$fullLoading = fullLoading
  }
}
