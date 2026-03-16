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

  //上传管理
  UPLOAD: {
    UPLOADIMAGE: `/shopadminApi/UploadFile/uploadImage`,
    UPLOADFILE: `/shopadminApi/UploadFile/uploadFile`,
    UPLOADAUDIO: `/shopadminApi/UploadFile/uploadAudio`,
  },


  // 商户管理
  SHOP: {
    LIST: `/shopadminApi/Shop/getShopsPageList`,
    UPDATE: '/shopadminApi/Shop/updateShops',
    DETAIL: (id) => `/shopadminApi/Shop/deleteShops?id=${id}`,
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
    DELETE: (id) => `/shopadminApi/Product/deleteProducts?id=${id}`,
    DELETEBATCH: (ids) => `/shopadminApi/Product/deleteBatchProducts?ids=${ids}`,
    UPDATE: '/shopadminApi/Product/updateProducts',
    CATEGORIESOPTIONS: `/shopadminApi/Product/getCategoriesOptions`,
    DETAIL: (id) => `/shopadminApi/Product/getProductsById?id=${id}`,

    DELETESPECS: (id) => `/shopadminApi/Product/deleteProductSpecs?id=${id}`,
    DELETEBATCHSPECS: (ids) => `/shopadminApi/Product/deleteBatchProductSpecs?ids=${ids}`,

    UPDATEPRODUCTSPECIMAGE: '/shopadminApi/Product/updateProductSpecsImage',
  },

  // 秒杀管理
  SECKILL: {
    LIST: `/shopadminApi/Seckill/getSeckillPageList`,
    UPDATE: '/shopadminApi/Seckill/updateSeckill',
    DETAIL: (id) => `/shopadminApi/Seckill/deleteSeckill?id=${id}`,
    TIMEOPTIONS: (appType) => `/shopadminApi/Seckill/getTimeOptions?appType=${appType}`,
  },

  // 订单管理
  ORDER: {
    LIST: '/shopadminApi/Order/getOrdersPageList',
    DETAIL: (id) => `/shopadminApi/Order/getOrdersById?id=${id}`,
    UPDATE: '/shopadminApi/Order/updateOrders',
    /** 
    DELETE: '/shopadminApi/Order/deleteOrder', // 删除订单
    BATCH_SHIP: '/shopadminApi/Order/batchShipOrder', // 批量发货，暂时注释掉，测试期间先使用 UPDATE 代替
    BATCH_DELETE: '/shopadminApi/Order/batchDeleteOrders', // 批量删除
    BATCH_UPDATE_STATUS: '/shopadminApi/Order/batchUpdateOrderStatus', // 批量更新状态
    STATISTICS: '/shopadminApi/Order/getOrderStatistics', // 订单统计，日后功能
    CATEGORIESOPTIONS: '/shopadminApi/Order/getCategoriesOptions'  // 分类选项
    */
  },


  // 分类管理 
  CATEGORY: {
    LIST: `/shopadminApi/Category/getCategoriesList`,
    UPDATE: '/shopadminApi/Category/updateCategories',
    DETAIL: (id) => `/shopadminApi/Category/deleteCategories?id=${id}`

  },


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