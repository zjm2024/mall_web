/**
 * 订单管理 API 接口
 * @description 订单管理 API 接口，用于处理订单相关的请求。
 * @memberof module:api/order
 * 
 * 后端实体: Orders (mall_orders)
 * 主要字段:
 * - OrderId: 订单ID (主键)
 * - OrderNo: 订单号
 * - PersonalID: 买家ID
 * - BusinessId: 商家ID
 * - TotalAmount: 订单总金额
 * - PayAmount: 实际支付金额
 * - PayStatus: 支付状态 (0-待支付 1-已支付 2-已取消)
 * - OrderStatus: 订单状态 (0-待处理 1-已发货 2-已完成 3-已关闭)
 * - RiskLevel: 风险等级 (0-正常 1-可疑 2-高风险)
 */
import request from '@/utils/request'
import { API_PATHS } from '@/constants/api'

// 订单状态枚举
export const OrderStatus = {
  PENDING: 0,      // 待处理
  SHIPPED: 1,      // 已发货
  COMPLETED: 2,    // 已完成
  CLOSED: 3        // 已关闭
}

// 支付状态枚举
export const PayStatus = {
  UNPAID: 0,      // 待支付
  PAID: 1,        // 已支付
  CANCELLED: 2    // 已取消
}

// 风险等级枚举
export const RiskLevel = {
  NORMAL: 0,      // 正常
  SUSPICIOUS: 1,  // 可疑
  HIGH: 2         // 高风险
}

// 支付方式枚举
export const PaymentMethod = {
  WECHAT: 0,      // 微信支付
  BALANCE: 1,     // 余额支付
  MIXED: 2        // 混合支付
}

// 活动类型枚举
export const ActivityType = {
  NORMAL: 0,      // 普通
  SECKILL: 1,     // 秒杀
  GROUP: 2        // 团购
}

// 调试：检查导入
console.log('[order.js] API_PATHS loaded:', API_PATHS)
console.log('[order.js] API_PATHS.Order:', API_PATHS?.Order)

// 保护性检查：如果 ORDER 不存在，添加它
if (!API_PATHS.Order) {
  console.error('[order.js] API_PATHS.Order is undefined! Adding fallback...')
  API_PATHS.ORDER = {
    LIST: '/shopadminApi/Order/getOrdersPageList',
    DETAIL: (id) => `/shopadminApi/Order/getOrderDetail?id=${id}`,
    UPDATE: '/shopadminApi/Order/updateOrder',
    DELETE: '/shopadminApi/Order/deleteOrder',
    SHIP: '/shopadminApi/Order/shipOrder',
    BATCH_DELETE: '/shopadminApi/Order/batchDeleteOrders',
    BATCH_UPDATE_STATUS: '/shopadminApi/Order/batchUpdateOrderStatus',
    STATISTICS: '/shopadminApi/Order/getOrderStatistics',
    CATEGORIESOPTIONS: '/shopadminApi/Order/getCategoriesOptions'
  }
}

// 确保 Order（大写）存在
if (!API_PATHS.Order && API_PATHS.ORDER) {
  API_PATHS.Order = API_PATHS.ORDER
}

// 订单管理 API
const orderApi = {
  /**
   * 获取订单列表（分页）
   * @param {Object} params - 查询参数
   * @param {number} params.pageIndex - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.searchKey - 搜索关键字（订单号、收货人姓名、电话）
   * @param {number} params.orderStatus - 订单状态
   * @param {number} params.payStatus - 支付状态
   * @param {number} params.riskLevel - 风险等级
   * @param {number} params.appType - 应用类型
   * @param {string} params.startTime - 开始时间
   * @param {string} params.endTime - 结束时间
   * @returns {Promise}
   */
  getOrderPageList(params) {
    console.log('[orderApi] getOrderPageList called with params:', params)
    if (!API_PATHS.Order) {
      console.error('[orderApi] API_PATHS.Order is undefined!')
      return Promise.reject(new Error('API_PATHS.Order is undefined'))
    }
    return request.post(API_PATHS.Order.LIST, params)
  },

  /**
   * 获取订单详情
   * @param {number} orderId - 订单ID
   * @returns {Promise}
   */
  getOrderDetail(orderId) {
    if (!API_PATHS.Order) {
      return Promise.reject(new Error('API_PATHS.Order is undefined'))
    }
    return request.get(API_PATHS.Order.DETAIL(orderId))
  },

  /**
   * 创建订单
   * @param {Object} data - 订单数据
   * @returns {Promise}
   */
  createOrder(data) {
    return request.post('/shopadminApi/Order/createOrder', data)
  },

  /**
   * 更新订单
   * @param {Object} data - 订单数据（包含OrderId）
   * @returns {Promise}
   */
  updateOrder(data) {
    if (!API_PATHS.Order) {
      return Promise.reject(new Error('API_PATHS.Order is undefined'))
    }
    return request.post(API_PATHS.Order.UPDATE, data)
  },

  /**
   * 删除订单
   * @param {number} orderId - 订单ID
   * @returns {Promise}
   */
  deleteOrder(orderId) {
    if (!API_PATHS.Order) {
      return Promise.reject(new Error('API_PATHS.Order is undefined'))
    }
    return request.get(API_PATHS.Order.DELETE, { params: { orderId } })
  },

  /**
   * 发货
   * @param {Object} data - 发货数据
   * @param {number} data.orderId - 订单ID
   * @param {string} data.shippingNo - 物流单号
   * @returns {Promise}
   */
  shipOrder(data) {
    if (!API_PATHS.Order) {
      return Promise.reject(new Error('API_PATHS.Order is undefined'))
    }
    return request.post(API_PATHS.Order.SHIP, data)
  },

  /**
   * 批量删除订单
   * @param {Object} data - 批量删除数据
   * @param {Array<number>} data.orderIds - 订单ID列表
   * @returns {Promise}
   */
  batchDeleteOrders(data) {
    if (!API_PATHS.Order) {
      return Promise.reject(new Error('API_PATHS.Order is undefined'))
    }
    return request.post(API_PATHS.Order.BATCH_DELETE, data)
  },

  /**
   * 批量更新订单状态
   * @param {Object} data - 批量更新数据
   * @param {Array<number>} data.orderIds - 订单ID列表
   * @param {number} data.orderStatus - 订单状态
   * @returns {Promise}
   */
  batchUpdateOrderStatus(data) {
    if (!API_PATHS.Order) {
      return Promise.reject(new Error('API_PATHS.Order is undefined'))
    }
    return request.post(API_PATHS.Order.BATCH_UPDATE_STATUS, data)
  },

  /**
   * 获取订单统计
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getOrderStatistics(params) {
    if (!API_PATHS.Order) {
      return Promise.reject(new Error('API_PATHS.Order is undefined'))
    }
    return request.get(API_PATHS.Order.STATISTICS, { params })
  },

  /**
   * 获取分类列表（用于下拉选择）
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getCategoryOptions(params) {
    if (!API_PATHS.Order) {
      return Promise.reject(new Error('API_PATHS.Order is undefined'))
    }
    return request.get(API_PATHS.Order.CATEGORIESOPTIONS, { params })
  },

  /**
   * 获取订单状态文本
   * @param {number} status - 订单状态值
   * @returns {string} 状态文本
   */
  getOrderStatusText(status) {
    const statusMap = {
      [OrderStatus.PENDING]: '待处理',
      [OrderStatus.SHIPPED]: '已发货',
      [OrderStatus.COMPLETED]: '已完成',
      [OrderStatus.CLOSED]: '已关闭'
    }
    return statusMap[status] || '未知'
  },

  /**
   * 获取订单状态类型（用于 Element Plus Tag）
   * @param {number} status - 订单状态值
   * @returns {string} 类型
   */
  getOrderStatusType(status) {
    const typeMap = {
      [OrderStatus.PENDING]: 'warning',
      [OrderStatus.SHIPPED]: 'primary',
      [OrderStatus.COMPLETED]: 'success',
      [OrderStatus.CLOSED]: 'info'
    }
    return typeMap[status] || 'info'
  },

  /**
   * 获取支付状态文本
   * @param {number} status - 支付状态值
   * @returns {string} 状态文本
   */
  getPayStatusText(status) {
    const statusMap = {
      [PayStatus.UNPAID]: '待支付',
      [PayStatus.PAID]: '已支付',
      [PayStatus.CANCELLED]: '已取消'
    }
    return statusMap[status] || '未知'
  },

  /**
   * 获取支付状态类型
   * @param {number} status - 支付状态值
   * @returns {string} 类型
   */
  getPayStatusType(status) {
    const typeMap = {
      [PayStatus.UNPAID]: 'warning',
      [PayStatus.PAID]: 'success',
      [PayStatus.CANCELLED]: 'info'
    }
    return typeMap[status] || 'info'
  },

  /**
   * 获取风险等级文本
   * @param {number} level - 风险等级值
   * @returns {string} 等级文本
   */
  getRiskLevelText(level) {
    const levelMap = {
      [RiskLevel.NORMAL]: '正常',
      [RiskLevel.SUSPICIOUS]: '可疑',
      [RiskLevel.HIGH]: '高风险'
    }
    return levelMap[level] || '未知'
  },

  /**
   * 获取风险等级类型
   * @param {number} level - 风险等级值
   * @returns {string} 类型
   */
  getRiskLevelType(level) {
    const typeMap = {
      [RiskLevel.NORMAL]: 'success',
      [RiskLevel.SUSPICIOUS]: 'warning',
      [RiskLevel.HIGH]: 'danger'
    }
    return typeMap[level] || 'info'
  }
}

// 导出单个方法
export const {
  getOrderPageList,
  getOrderDetail,
  createOrder,
  updateOrder,
  deleteOrder,
  shipOrder,
  batchDeleteOrders,
  batchUpdateOrderStatus,
  getOrderStatistics,
  getCategoryOptions,
  getOrderStatusText,
  getOrderStatusType,
  getPayStatusText,
  getPayStatusType,
  getRiskLevelText,
  getRiskLevelType
} = orderApi

export default orderApi
