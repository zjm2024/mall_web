// constants/role.js

// 权限定义（基于您的表结构只有两种角色）
export const PERMISSION_TYPES = {
  SUPER_ADMIN: 'super_admin',      // 超级管理员
  MERCHANT_ADMIN: 'merchant_admin' // 商户管理员
}

// 路由权限映射
export const ROUTE_PERMISSIONS = {
  // 仪表盘
  '/dashboard': ['super_admin', 'merchant_admin'],

  // 店铺管理
  '/shop/base': ['super_admin', 'merchant_admin'],
  '/shop/home': ['super_admin', 'merchant_admin'],
  '/shop/category': ['super_admin', 'merchant_admin'],
  '/shop/member': ['super_admin', 'merchant_admin'],

  // 商品管理
  '/product/list': ['super_admin', 'merchant_admin'],
  '/product/edit': ['super_admin', 'merchant_admin'],
  '/product/add': ['super_admin', 'merchant_admin'],

  // 订单管理
  '/order/list': ['super_admin', 'merchant_admin'],

  // 售后管理
  '/after-sale/list': ['super_admin', 'merchant_admin'],

  // 资金结算
  '/settlement/list': ['super_admin', 'merchant_admin']
}

// 按钮操作权限
export const ACTION_PERMISSIONS = {
  // 商品相关操作
  PRODUCT_CREATE: ['super_admin', 'merchant_admin'],
  PRODUCT_UPDATE: ['super_admin', 'merchant_admin'],
  PRODUCT_DELETE: ['super_admin', 'merchant_admin'],

  // 订单相关操作
  ORDER_PROCESS: ['super_admin', 'merchant_admin'],

  // 店铺相关操作
  SHOP_CONFIG: ['super_admin', 'merchant_admin'],

  // 只有超管能操作
  SYSTEM_CONFIG: ['super_admin'],
  USER_MANAGE: ['super_admin']
}

// 检查路由权限
export function checkRoutePermission(path, userRole) {
  const allowedRoles = ROUTE_PERMISSIONS[path]
  if (!allowedRoles) return true // 没有设置权限的路由默认允许访问
  return allowedRoles.includes(userRole)
}

// 检查操作权限
export function checkActionPermission(action, userRole) {
  const allowedRoles = ACTION_PERMISSIONS[action]
  if (!allowedRoles) return false // 没有设置权限的操作默认不允许
  return allowedRoles.includes(userRole)
}

// 获取用户角色（根据 isSuperAdmin 字段）
export function getUserRole(isSuperAdmin) {
  return isSuperAdmin ? PERMISSION_TYPES.SUPER_ADMIN : PERMISSION_TYPES.MERCHANT_ADMIN
}