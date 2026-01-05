// src/stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const sidebarCollapse = ref(localStorage.getItem('sidebarCollapse') === 'true')

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const isSuperAdmin = computed(() => userInfo.value.IsSuperAdmin === 1)
  const userRole = computed(() => isSuperAdmin.value ? 'super_admin' : 'merchant_admin')

  // 方法
  const setUser = (data) => {
    token.value = data.token
    userInfo.value = data.userInfo
    localStorage.setItem('token', data.token)
    localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
  }

  const clearUser = () => {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  const updateUserInfo = (info) => {
    userInfo.value = { ...userInfo.value, ...info }
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  const toggleSidebar = () => {
    sidebarCollapse.value = !sidebarCollapse.value
    localStorage.setItem('sidebarCollapse', sidebarCollapse.value)
  }

  const setSidebar = (collapsed) => {
    sidebarCollapse.value = collapsed
    localStorage.setItem('sidebarCollapse', collapsed)
  }

  // 模拟登录
  const login = async (loginData) => {
    try {
      // 模拟网络请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟响应数据
      const response = {
        code: 0,
        message: '登录成功',
        data: {
          token: 'mock_token_' + Date.now(),
          userInfo: {
            AdminId: 1,
            Username: loginData.username,
            RealName: loginData.username === 'admin' ? '系统管理员' : '商户用户',
            Phone: '13800138000',
            Email: 'test@example.com',
            Avatar: '',
            Status: 1,
            IsSuperAdmin: loginData.username === 'admin' ? 1 : 0,
            LastLoginTime: new Date().toISOString(),
            LastLoginIp: '192.168.1.1',
            LoginCount: 1,
            Remark: ''
          }
        }
      }
      
      setUser({
        token: response.data.token,
        userInfo: response.data.userInfo
      })
      
      return response
    } catch (error) {
      console.error('登录失败:', error)
      return {
        code: 500,
        message: '登录失败'
      }
    }
  }

  const logout = () => {
    clearUser()
  }

  return {
    // 状态
    token,
    userInfo,
    sidebarCollapse,
    
    // 计算属性
    isAuthenticated,
    isSuperAdmin,
    userRole,
    
    // 方法
    setUser,
    clearUser,
    updateUserInfo,
    toggleSidebar,
    setSidebar,
    login,
    logout
  }
})