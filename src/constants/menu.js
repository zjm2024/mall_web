// src/constants/menu.js

/**
 * 完整的菜单配置
 * 根据用户权限动态显示菜单
 */

// 图标映射表，确保所有图标都能正确显示
export const menuIcons = {
  'House': 'House',
  'Shop': 'Shop',
  'Goods': 'Goods',
  'Box': 'Box',
  'Service': 'Service',
  'Money': 'Money',
  'User': 'User',
  'Setting': 'Setting',
  'Document': 'Document',
  'TrendCharts': 'TrendCharts',
  'List': 'List',
  'OrderedList': 'OrderedList',
  'Picture': 'Picture',
  'Camera': 'Camera'
}

// 基础菜单配置（所有用户都有的菜单）
export const baseMenuList = [
  {
    title: '仪表盘',
    icon: 'House',
    path: '/dashboard',
    roles: ['super_admin', 'merchant_admin']
  },
  {
    title: '店铺管理',
    icon: 'Shop',
    roles: ['super_admin', 'merchant_admin'],
    children: [
      {
        title: '基础信息',
        path: '/shop/base',
        roles: ['super_admin', 'merchant_admin']
      },
      {
        title: '主页管理',
        path: '/shop/home',
        roles: ['super_admin', 'merchant_admin']
      },
      {
        title: '类型管理',
        path: '/shop/category',
        roles: ['super_admin', 'merchant_admin']
      },
      {
        title: '店员管理',
        path: '/shop/user',
        roles: ['super_admin', 'merchant_admin']
      }
    ]
  },
  {
    title: '商品管理',
    icon: 'Goods',
    roles: ['super_admin', 'merchant_admin'],
    children: [
      {
        title: '商品列表',
        path: '/product/list',
        roles: ['super_admin', 'merchant_admin']
      },
      {
        title: '添加商品',
        path: '/product/add',
        roles: ['super_admin', 'merchant_admin'],
        hidden: false // 在菜单中显示
      }
    ]
  },
  {
    title: '订单配送',
    icon: 'Box',
    roles: ['super_admin', 'merchant_admin'],
    children: [
      {
        title: '订单列表',
        path: '/order/list',
        roles: ['super_admin', 'merchant_admin']
      }
    ]
  },
  {
    title: '售后管理',
    icon: 'Service',
    roles: ['super_admin', 'merchant_admin'],
    children: [
      {
        title: '售后列表',
        path: '/after-sale/list',
        roles: ['super_admin', 'merchant_admin']
      }
    ]
  },
  {
    title: '资金结算',
    icon: 'Money',
    roles: ['super_admin', 'merchant_admin'],
    children: [
      {
        title: '结算列表',
        path: '/settlement/list',
        roles: ['super_admin', 'merchant_admin']
      }
    ]
  }
]

// 超管专属菜单（只有超管能看到）
export const adminMenuList = [
  // 这里可以添加只有超管能看到的菜单
  // 例如：系统设置、日志管理、权限管理等
  {
    title: '系统管理',
    icon: 'Setting',
    roles: ['super_admin'], // 只有超管
    children: [
      {
        title: '用户管理',
        path: '/system/user',
        roles: ['super_admin']
      },
      {
        title: '系统设置',
        path: '/system/settings',
        roles: ['super_admin']
      }
    ]
  }
]

/**
 * 根据用户权限获取菜单列表
 * @param {boolean} isSuperAdmin - 是否是超级管理员
 * @returns {Array} 过滤后的菜单列表
 */
export function getMenuByUser(isSuperAdmin) {
  const userRole = isSuperAdmin ? 'super_admin' : 'merchant_admin'

  // 基础菜单
  let filteredMenu = filterMenuByRole(baseMenuList, userRole)

  // 如果是超管，添加超管专属菜单
  if (isSuperAdmin) {
    const adminMenu = filterMenuByRole(adminMenuList, userRole)
    filteredMenu = [...filteredMenu, ...adminMenu]
  }

  return filteredMenu
}

/**
 * 根据角色过滤菜单
 * @param {Array} menuList - 菜单列表
 * @param {string} userRole - 用户角色
 * @returns {Array} 过滤后的菜单
 */
function filterMenuByRole(menuList, userRole) {
  return menuList
    .filter(menu => {
      // 如果没有设置 roles，默认所有用户都能看到
      if (!menu.roles) return true

      // 检查用户是否有权限
      const hasPermission = menu.roles.includes(userRole)

      // 如果有子菜单，需要检查子菜单是否有权限
      if (menu.children && menu.children.length > 0) {
        menu.children = filterMenuByRole(menu.children, userRole)
        // 如果过滤后子菜单为空，则隐藏父菜单
        return menu.children.length > 0
      }

      return hasPermission
    })
    .map(menu => ({
      ...menu,
      // 确保每个菜单项都有完整的属性
      icon: menu.icon || '',
      path: menu.path || '',
      children: menu.children || []
    }))
}

/**
 * 获取扁平化的菜单路径列表
 * @param {Array} menuList - 菜单列表
 * @returns {Array} 所有菜单路径的数组
 */
export function getMenuPaths(menuList) {
  const paths = []

  function traverse(menus) {
    for (const menu of menus) {
      if (menu.path && !menu.hidden) {
        paths.push(menu.path)
      }
      if (menu.children && menu.children.length > 0) {
        traverse(menu.children)
      }
    }
  }

  traverse(menuList)
  return paths
}

/**
 * 检查用户是否有访问某个路由的权限
 * @param {string} path - 路由路径
 * @param {boolean} isSuperAdmin - 是否是超级管理员
 * @returns {boolean} 是否有权限
 */
export function checkRoutePermission(path, isSuperAdmin) {
  const userRole = isSuperAdmin ? 'super_admin' : 'merchant_admin'

  // 检查基础菜单
  const hasBasePermission = checkPathInMenu(baseMenuList, path, userRole)

  // 如果是超管，检查超管菜单
  if (isSuperAdmin) {
    const hasAdminPermission = checkPathInMenu(adminMenuList, path, userRole)
    return hasBasePermission || hasAdminPermission
  }

  return hasBasePermission
}

/**
 * 检查路径是否在菜单中且有权限
 */
function checkPathInMenu(menuList, targetPath, userRole) {
  for (const menu of menuList) {
    // 检查当前菜单
    if (menu.path === targetPath) {
      return !menu.roles || menu.roles.includes(userRole)
    }

    // 检查子菜单
    if (menu.children && menu.children.length > 0) {
      const found = checkPathInMenu(menu.children, targetPath, userRole)
      if (found) return true
    }
  }

  return false
}

/**
 * 根据路径获取菜单项信息
 * @param {string} path - 路由路径
 * @param {Array} menuList - 菜单列表
 * @returns {Object|null} 菜单项信息
 */
export function getMenuByPath(path, menuList) {
  for (const menu of menuList) {
    if (menu.path === path) {
      return menu
    }

    if (menu.children && menu.children.length > 0) {
      const found = getMenuByPath(path, menu.children)
      if (found) return found
    }
  }

  return null
}

/**
 * 获取面包屑导航数据
 * @param {string} currentPath - 当前路由路径
 * @param {Array} menuList - 菜单列表
 * @returns {Array} 面包屑数组
 */
export function getBreadcrumb(currentPath, menuList) {
  const breadcrumb = []

  function findPath(menus, path, parents = []) {
    for (const menu of menus) {
      const currentParents = [...parents, menu]

      if (menu.path === path) {
        breadcrumb.push(...currentParents)
        return true
      }

      if (menu.children && menu.children.length > 0) {
        if (findPath(menu.children, path, currentParents)) {
          return true
        }
      }
    }
    return false
  }

  findPath(menuList, currentPath)
  return breadcrumb.map(item => ({
    title: item.title,
    path: item.path
  }))
}

// 默认导出（兼容旧代码）
export const fullMenuList = baseMenuList