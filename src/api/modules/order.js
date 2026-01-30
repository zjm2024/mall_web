
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
   * @param {string} params.startTime - 开始时间
   * @param {string} params.endTime - 结束时间
   * @returns {Promise}
   */
  getOrderPageList(params) {
    // 使用硬编码路径，仿照createOrder的做法
    return request.post('/shopadminApi/Order/getOrdersPageList', { params: params })
  },

  /**
   * 获取订单详情
   * @param {number} orderId - 订单ID
   * @returns {Promise}
   */
  getOrderDetail(orderId) {
    return request.get(`/shopadminApi/Order/getOrdersById?id=${orderId}`)
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
    if (!API_PATHS.ORDER) {
      return Promise.reject(new Error('API_PATHS.ORDER is undefined'))
    }
    return request.post(API_PATHS.ORDER.UPDATE, { data: data });
  },

  /**
   * 发货
   * @param {Object} data - 发货数据
   * @param {number} data.orderId - 订单ID
   * @param {string} data.shippingNo - 物流单号
   * @returns {Promise}
   */
  shipOrder(data) {
    if (!API_PATHS.ORDER) {
      return Promise.reject(new Error('API_PATHS.ORDER is undefined'))
    }
    return request.post(API_PATHS.ORDER.SHIP, data)
  },
  
  /**
   * 批量更新订单状态
   * @param {Object} data - 批量更新数据
   * @param {Array<number>} data.orderIds - 订单ID列表
   * @param {number} data.orderStatus - 订单状态
   * @returns {Promise}
   */
  batchUpdateOrderStatus(data) {
    if (!API_PATHS.ORDER) {
      return Promise.reject(new Error('API_PATHS.ORDER is undefined'))
    }
    return request.post(API_PATHS.ORDER.BATCH_UPDATE_STATUS, data)
  },

  /**
   * 获取订单统计
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getOrderStatistics(params) {
    if (!API_PATHS.ORDER) {
      return Promise.reject(new Error('API_PATHS.ORDER is undefined'))
    }
    return request.get(API_PATHS.ORDER.STATISTICS, { params })
  },

  /**
   * 获取分类列表（用于下拉选择）
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getCategoryOptions(params) {
    if (!API_PATHS.ORDER) {
      return Promise.reject(new Error('API_PATHS.ORDER is undefined'))
    }
    return request.get(API_PATHS.ORDER.CATEGORIESOPTIONS, { params })
  },
}

// 导出默认 API 对象
export default orderApi
