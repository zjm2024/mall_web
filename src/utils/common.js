import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

// 防抖函数
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout, args, context, timestamp, result

  const later = function() {
    const last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = Date.now()
    const callNow = immediate && !timeout
    
    if (!timeout) timeout = setTimeout(later, wait)
    
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// 节流函数
export const throttle = (func, wait = 300, options = {}) => {
  let timeout, context, args, result
  let previous = 0

  const later = function() {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  const throttled = function(...args) {
    const now = Date.now()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    args = args

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }

  throttled.cancel = function() {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }

  return throttled
}

// 深拷贝
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof RegExp) return new RegExp(obj)
  
  if (Array.isArray(obj)) {
    const arrCopy = []
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i])
    }
    return arrCopy
  }
  
  if (typeof obj === 'object') {
    const objCopy = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = deepClone(obj[key])
      }
    }
    return objCopy
  }
}

// 对象合并（深合并）
export const deepMerge = (target, source) => {
  if (!source || typeof source !== 'object') return target
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {}
        }
        deepMerge(target[key], source[key])
      } else {
        target[key] = source[key]
      }
    }
  }
  
  return target
}

// 格式化日期
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  
  const d = new Date(date)
  const pad = (n) => n.toString().padStart(2, '0')
  
  const replacements = {
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
    SSS: pad(d.getMilliseconds(), 3)
  }
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS/g, match => replacements[match])
}

// 格式化文件大小
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 生成唯一ID
export const generateId = () => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 获取URL参数
export const getUrlParams = (url = window.location.href) => {
  const params = {}
  const urlObj = new URL(url)
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

// 设置URL参数
export const setUrlParams = (params, url = window.location.href) => {
  const urlObj = new URL(url)
  Object.keys(params).forEach(key => {
    urlObj.searchParams.set(key, params[key])
  })
  return urlObj.toString()
}

// 消息提示封装
export const message = {
  success: (msg, duration = 2000) => {
    ElMessage.success({
      message: msg,
      duration
    })
  },
  
  error: (msg, duration = 2000) => {
    ElMessage.error({
      message: msg,
      duration
    })
  },
  
  warning: (msg, duration = 2000) => {
    ElMessage.warning({
      message: msg,
      duration
    })
  },
  
  info: (msg, duration = 2000) => {
    ElMessage.info({
      message: msg,
      duration
    })
  }
}

// 确认对话框封装
export const confirm = (title, message, options = {}) => {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    ...options
  })
}

// 通知封装
export const notification = {
  success: (title, message, duration = 4500) => {
    ElNotification.success({
      title,
      message,
      duration
    })
  },
  
  error: (title, message, duration = 4500) => {
    ElNotification.error({
      title,
      message,
      duration
    })
  },
  
  warning: (title, message, duration = 4500) => {
    ElNotification.warning({
      title,
      message,
      duration
    })
  },
  
  info: (title, message, duration = 4500) => {
    ElNotification.info({
      title,
      message,
      duration
    })
  }
}

// 复制到剪贴板
export const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(resolve).catch(reject)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        successful ? resolve() : reject(new Error('复制失败'))
      } catch (err) {
        document.body.removeChild(textArea)
        reject(err)
      }
    }
  })
}

// 下载文件
export const downloadFile = (content, fileName) => {
  const blob = new Blob([content])
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export default {
  debounce,
  throttle,
  deepClone,
  deepMerge,
  formatDate,
  formatFileSize,
  generateId,
  getUrlParams,
  setUrlParams,
  message,
  confirm,
  notification,
  copyToClipboard,
  downloadFile
}