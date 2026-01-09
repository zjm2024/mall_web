// API 接口常量
export const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || '/api'

// API 超时时间（毫秒）
export const API_TIMEOUT = 30000

// HTTP 状态码
export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

// API 路径常量
export const API_PATHS = {
  // 认证相关
  AUTH: {
    LOGIN: '/shopadminApi/User/validAccount',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    PROFILE: '/auth/profile'
  },

  // 店铺管理
  SHOP: {
    BASE: '/shop',
    INFO: '/shop/info',
    MEMBERS: '/shop/members',
    MEMBER_DETAIL: (id) => `/shop/members/${id}`,
    LOGIN_RECORDS: '/shop/login-records',
    OPERATION_LOGS: '/shop/operation-logs'
  },
  // 用户管理
  USER: {
    LIST: `/shopadminApi/User/getAdminaccountsPageList`,
    UPDATE: '/shopadminApi/User/updateUsers',
    DETAIL: (id) => `/shopadminApi/User/deleteUsers?id=${id}`,
    RESETUSERPASSWORD: '/shopadminApi/User/resetUserPassword',
    CHANGEUSERPASSWORD: '/shopadminApi/User/changeUserPassword'
  },



  // 商品管理
  PRODUCT: {
    LIST: `/shopadminApi/Product/getProductsPageList`,
    DETAIL: (id) => `/products/${id}`,
    CATEGORIESOPTIONS: `/shopadminApi/Product/getCategoriesOptions`,
    BRANDS: '/products/brands'
  },

  // 订单管理
  ORDER: {
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    STATISTICS: '/orders/statistics'
  },


  // 分类管理 
  CATEGORY: {
    LIST: `/shopadminApi/Category/getCategoriesList`,
    UPDATE: '/shopadminApi/Category/updateCategories',
    DETAIL: (id) => `/shopadminApi/Category/deleteCategories?id=${id}`

  },

  // 文件上传
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file'
  }
}

// 响应代码
export const RESPONSE_CODE = {
  SUCCESS: 1,
  ERROR: 0,
  TOKEN_EXPIRED: 1001,
  NO_PERMISSION: 1002,
  PARAM_ERROR: 1003,
  RESOURCE_NOT_FOUND: 1004
}