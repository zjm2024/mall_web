/**
 * 订单相关常量定义
 * 基于后端实体 Orders (mall_orders)
 */

/**
 * 订单状态枚举
 * @description 对应后端字段: OrderStatus
 */
export const OrderStatus = {
  PENDING: 0,      // 待处理
  SHIPPED: 1,      // 已发货
  COMPLETED: 2,    // 已完成
  CLOSED: 3        // 已关闭
}

/**
 * 支付状态枚举
 * @description 对应后端字段: PayStatus
 */
export const PayStatus = {
  UNPAID: 0,      // 待支付
  PAID: 1,        // 已支付
  CANCELLED: 2    // 已取消
}

/**
 * 风险等级枚举
 * @description 对应后端字段: RiskLevel
 */
export const RiskLevel = {
  NORMAL: 0,      // 正常
  SUSPICIOUS: 1,  // 可疑
  HIGH: 2         // 高风险
}

/**
 * 支付方式枚举
 * @description 对应后端字段: PaymentMethod
 */
export const PaymentMethod = {
  WECHAT: 0,      // 微信支付
  BALANCE: 1,     // 余额支付
  MIXED: 2        // 混合支付
}

/**
 * 活动类型枚举
 * @description 对应后端字段: ActivityType
 */
export const ActivityType = {
  NORMAL: 0,      // 普通
  SECKILL: 1,     // 秒杀
  GROUP: 2        // 团购
}

/**
 * 团购状态枚举
 * @description 对应后端字段: GroupBuyStatus
 */
export const GroupBuyStatus = {
  NORMAL: 0,      // 普通
  WAITING: 1,     // 待成团
  SUCCESS: 2,     // 已成团
  FAILED: 3       // 失败
}


/**
 * 订单状态映射（显示文本）
 */
export const OrderStatusMap = {
  [OrderStatus.PENDING]: { text: '待处理', type: 'warning' },
  [OrderStatus.SHIPPED]: { text: '已发货', type: 'primary' },
  [OrderStatus.COMPLETED]: { text: '已完成', type: 'success' },
  [OrderStatus.CLOSED]: { text: '已关闭', type: 'info' }
}

/**
 * 支付状态映射（显示文本）
 */
export const PayStatusMap = {
  [PayStatus.UNPAID]: { text: '待支付', type: 'warning' },
  [PayStatus.PAID]: { text: '已支付', type: 'success' },
  [PayStatus.CANCELLED]: { text: '已取消', type: 'info' }
}

/**
 * 风险等级映射（显示文本）
 */
export const RiskLevelMap = {
  [RiskLevel.NORMAL]: { text: '正常', type: 'success' },
  [RiskLevel.SUSPICIOUS]: { text: '可疑', type: 'warning' },
  [RiskLevel.HIGH]: { text: '高风险', type: 'danger' }
}

/**
 * 支付方式映射（显示文本）
 */
export const PaymentMethodMap = {
  [PaymentMethod.WECHAT]: { text: '微信支付' },
  [PaymentMethod.BALANCE]: { text: '余额支付' },
  [PaymentMethod.MIXED]: { text: '混合支付' }
}

/**
 * 活动类型映射（显示文本）
 */
export const ActivityTypeMap = {
  [ActivityType.NORMAL]: { text: '普通订单' },
  [ActivityType.SECKILL]: { text: '秒杀活动' },
  [ActivityType.GROUP]: { text: '团购活动' }
}

/**
 * 团购状态映射（显示文本）
 */
export const GroupBuyStatusMap = {
  [GroupBuyStatus.NORMAL]: { text: '普通订单', type: 'info' },
  [GroupBuyStatus.WAITING]: { text: '待成团', type: 'warning' },
  [GroupBuyStatus.SUCCESS]: { text: '已成团', type: 'success' },
  [GroupBuyStatus.FAILED]: { text: '失败', type: 'danger' }
}

/**
 * 获取订单状态文本
 * @param {number} status - 订单状态值
 * @returns {string} 状态文本
 */
export function getOrderStatusText(status) {
  return OrderStatusMap[status]?.text || '未知状态'
}

/**
 * 获取订单状态类型（用于 Element Plus Tag）
 * @param {number} status - 订单状态值
 * @returns {string} 类型
 */
export function getOrderStatusType(status) {
  return OrderStatusMap[status]?.type || 'info'
}

/**
 * 获取支付状态文本
 * @param {number} status - 支付状态值
 * @returns {string} 状态文本
 */
export function getPayStatusText(status) {
  return PayStatusMap[status]?.text || '未知状态'
}

/**
 * 获取支付状态类型
 * @param {number} status - 支付状态值
 * @returns {string} 类型
 */
export function getPayStatusType(status) {
  return PayStatusMap[status]?.type || 'info'
}

/**
 * 获取风险等级文本
 * @param {number} level - 风险等级值
 * @returns {string} 等级文本
 */
export function getRiskLevelText(level) {
  return RiskLevelMap[level]?.text || '未知'
}

/**
 * 获取风险等级类型
 * @param {number} level - 风险等级值
 * @returns {string} 类型
 */
export function getRiskLevelType(level) {
  return RiskLevelMap[level]?.type || 'info'
}

/**
 * 获取支付方式文本
 * @param {number} method - 支付方式值
 * @returns {string} 支付方式文本
 */
export function getPaymentMethodText(method) {
  return PaymentMethodMap[method]?.text || '未知'
}

/**
 * 获取活动类型文本
 * @param {number} type - 活动类型值
 * @returns {string} 活动类型文本
 */
export function getActivityTypeText(type) {
  return ActivityTypeMap[type]?.text || '未知'
}

/**
 * 获取团购状态文本
 * @param {number} status - 团购状态值
 * @returns {string} 团购状态文本
 */
export function getGroupBuyStatusText(status) {
  return GroupBuyStatusMap[status]?.text || '未知'
}

/**
 * 获取团购状态类型
 * @param {number} status - 团购状态值
 * @returns {string} 类型
 */
export function getGroupBuyStatusType(status) {
  return GroupBuyStatusMap[status]?.type || 'info'
}
