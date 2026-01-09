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
  const isSuperAdmin = computed(() => userInfo.value.isSuperAdmin === 1)
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



  const login = (token, userData) => {
    setUser({
      token: token,
      userInfo: userData
    })
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