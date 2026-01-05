import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS, RESPONSE_CODE } from '@/constants/api'

// 创建 axios 实例
const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在请求发送之前处理
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params
        //_t: Date.now()
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data, config } = response

    // 处理二进制数据（如文件下载）
    if (response.config.responseType === 'blob') {
      return response
    }

    // 根据业务代码处理响应
    if (data.flag === RESPONSE_CODE.SUCCESS) {
      return data
    }

    // token 过期
    if (data.flag === RESPONSE_CODE.TOKEN_EXPIRED) {
      ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        window.location.href = '/login'
      })
      return Promise.reject(new Error(data.message || 'Token expired'))
    }

    // 无权限
    if (data.flag === RESPONSE_CODE.NO_PERMISSION) {
      ElMessage.error('您没有权限执行此操作')
      return Promise.reject(new Error(data.message || 'No permission'))
    }

    // 请求错误
    if (data.flag === RESPONSE_CODE.ERROR) {
      ElMessage.error(data.message);
      return Promise.reject(new Error(data.message))
    }

    // 其他错误
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message || 'Request failed'))
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          ElMessage.error('未授权，请重新登录')
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')
          window.location.href = '/login'
          break
        case HTTP_STATUS.FORBIDDEN:
          ElMessage.error('拒绝访问')
          break
        case HTTP_STATUS.NOT_FOUND:
          ElMessage.error(`请求地址不存在: ${error.config.url}`)
          break
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          ElMessage.error('服务器内部错误')
          break
        case HTTP_STATUS.BAD_GATEWAY:
          ElMessage.error('网关错误')
          break
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
          ElMessage.error('服务不可用')
          break
        case HTTP_STATUS.GATEWAY_TIMEOUT:
          ElMessage.error('网关超时')
          break
        default:
          ElMessage.error(data?.message || `请求错误: ${status}`)
      }
    } else if (error.request) {
      // 请求超时或网络错误
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        ElMessage.error('请求超时，请检查网络连接')
      } else {
        ElMessage.error('网络错误，请检查网络连接')
      }
    } else {
      ElMessage.error(error.message || '请求配置错误')
    }

    return Promise.reject(error)
  }
)

// 导出常用的请求方法
export const get = (url, params = {}, config = {}) => {
  return request.get(url, { params, ...config })
}
/*
export const post = (url, data = {}, config = {}) => {
  return request.post(url, data, config)
}
*/
export const put = (url, data = {}, config = {}) => {
  return request.put(url, data, config)
}

export const del = (url, params = {}, config = {}) => {
  return request.delete(url, { params, ...config })
}

// 文件上传
export const upload = (url, file, config = {}) => {
  const formData = new FormData()
  formData.append('file', file)

  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })
}

// 文件下载
export const download = (url, params = {}, filename = '') => {
  return request.get(url, {
    params,
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || `download_${Date.now()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  })
}

export default request