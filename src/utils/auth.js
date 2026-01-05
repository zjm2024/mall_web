//import { hasPermission } from '@/constants/role'
import { ElMessage } from 'element-plus'
import request from './request'
import { API_PATHS } from '../constants/api'
// Token 相关操作
export const Token = {
  // 获取 token
  get() {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  },

  // 设置 token
  set(token, remember = false) {
    if (remember) {
      localStorage.setItem('token', token)
    } else {
      sessionStorage.setItem('token', token)
    }
  },

  // 移除 token
  remove() {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
  },

  // 检查是否有 token
  has() {
    return !!this.get()
  }
}

// 用户信息相关
export const User = {
  // 获取用户信息
  getInfo() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
    try {
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },

  // 设置用户信息
  setInfo(user, remember = false) {
    const userStr = JSON.stringify(user)
    if (remember) {
      localStorage.setItem('user', userStr)
    } else {
      sessionStorage.setItem('user', userStr)
    }
  },

  // 移除用户信息
  removeInfo() {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
  },

  // 获取用户角色
  getRole() {
    const user = this.getInfo()
    return user?.role || null
  },

  // 检查是否是超级管理员
  isSuperAdmin() {
    const role = this.getRole()
    return role === 'super_admin'
  },

  // 检查是否是店主
  isShopOwner() {
    const role = this.getRole()
    return role === 'shop_owner'
  }
}

// 权限检查
export const checkPermission = (permission) => {
  const userRole = User.getRole()
  return hasPermission(userRole, permission)
}

// 权限指令（用于 v-permission 指令）
export const permission = {
  mounted(el, binding) {
    const { value } = binding
    const hasPerm = checkPermission(value)

    if (!hasPerm && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
}

// 角色检查
export const checkRole = (role) => {
  const userRole = User.getRole()
  return userRole === role
}

// 角色指令（用于 v-role 指令）
export const role = {
  mounted(el, binding) {
    const { value } = binding
    const hasRole = checkRole(value)

    if (!hasRole && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
}

// 登录API
export const login = async (username, password) => {
  let inputobj = { data: { UserName: username, Password: password, AppType: 1 } };
  try {
    const response = await request.post(API_PATHS.AUTH.LOGIN, inputobj);

    return response
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }

}

// 登出
export const logout = () => {
  Token.remove()
  User.removeInfo()
  ElMessage.success('已退出登录')
  window.location.href = '/login'
}

// 检查是否已登录
export const isLoggedIn = () => {
  return Token.has() && User.getInfo()
}

export default {
  Token,
  User,
  checkPermission,
  checkRole,
  permission,
  role,
  logout,
  isLoggedIn
}