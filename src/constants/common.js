// 通用常量
export const APP_INFO = {
  NAME: '微信小店管理后台',
  VERSION: '1.0.0',
  COPYRIGHT: '© 2023 微信小店',
  DESCRIPTION: '专业的微信小店管理平台'
}

// 分页默认配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
}

// 日期时间格式
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  FULL_DATETIME: 'YYYY-MM-DD HH:mm:ss.SSS'
}

// 状态常量
export const STATUS = {
  // 通用状态
  ACTIVE: 1,
  INACTIVE: 0,
  ENABLED: 1,
  DISABLED: 0,
  
  // 审核状态
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  
  // 订单状态
  ORDER: {
    UNPAID: 0,      // 待支付
    PAID: 1,        // 已支付
    SHIPPED: 2,     // 已发货
    DELIVERED: 3,   // 已送达
    COMPLETED: 4,   // 已完成
    CANCELLED: 5,   // 已取消
    REFUNDED: 6     // 已退款
  },
  
  // 商品状态
  PRODUCT: {
    DRAFT: 0,       // 草稿
    ON_SALE: 1,     // 上架中
    OFF_SALE: 2,    // 已下架
    SOLD_OUT: 3     // 售罄
  }
}

// 获取状态文本
export const getStatusText = (type, value) => {
  const statusMap = {
    order: {
      0: '待支付',
      1: '已支付',
      2: '已发货',
      3: '已送达',
      4: '已完成',
      5: '已取消',
      6: '已退款'
    },
    product: {
      0: '草稿',
      1: '上架中',
      2: '已下架',
      3: '售罄'
    },
    common: {
      0: '禁用',
      1: '启用',
      2: '待审核',
      3: '已拒绝'
    }
  }
  
  return statusMap[type]?.[value] || statusMap.common?.[value] || '未知状态'
}