// utils/permission.js
import { checkRoutePermission, checkActionPermission } from '@/constants/role'

/**
 * 检查路由权限
 * @param {string} path - 路由路径
 * @param {string} userRole - 用户角色
 * @returns {boolean}
 */
export function hasRoutePermission(path, userRole) {
  return checkRoutePermission(path, userRole)
}

/**
 * 检查操作权限
 * @param {string} action - 操作权限标识
 * @param {string} userRole - 用户角色
 * @returns {boolean}
 */
export function hasActionPermission(action, userRole) {
  return checkActionPermission(action, userRole)
}

/**
 * 权限指令（用于模板中的元素控制）
 */
export const permissionDirective = {
  mounted(el, binding) {
    const { value } = binding
    const store = inject('store')
    
    if (!store) {
      console.warn('Store not found')
      return
    }
    
    const userRole = store.getters['user/userRole']
    
    if (!hasActionPermission(value, userRole)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}