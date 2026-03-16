// 店铺信息配置常量

// 管理中心配置项
export const MANAGEMENT_CONFIGS = [
  { icon: 'Setting', label: '对接配置', tooltip: '配置系统对接参数' },
  { icon: 'User', label: '主体信息', tooltip: '管理商户主体信息' },
  { icon: 'DocumentCopy', label: '经营信息', tooltip: '查看和编辑经营信息' },
  { icon: 'ShoppingCart', label: '结算信息', tooltip: '配置结算账户信息' },
  { icon: 'DataAnalysis', label: '支付主体权', tooltip: '管理支付主体权限' },
  { icon: 'Histogram', label: '分账配置', tooltip: '配置分账规则' },
  { icon: 'Connection', label: '易支付配置', tooltip: '配置易支付接口' },
  { icon: 'Link', label: '网关配置', tooltip: '配置支付网关' }
]

// 账户操作配置
export const ACCOUNT_ACTIONS = [
  { icon: 'Edit', title: '编辑账户', action: 'edit' },
  { icon: 'List', title: '账户备注', action: 'remark' },
  { icon: 'MoreFilled', title: '更多操作', action: 'more' }
]

// 账户类型配置
export const ACCOUNT_TYPES = {
  PAID_INCOME: {
    name: '用户已支付入账金',
    iconClass: 'fa-brands fa-weixin',
    iconColor: '#00cb00',
    statusType: 'success'
  },
  UNUSED_RECHARGE: {
    name: '用户充值未用金',
    iconClass: 'fa-regular fa-credit-card',
    iconColor: '#a0a0a0',
    statusType: 'success'
  },
  DEPOSIT: {
    name: '店铺保证金',
    iconClass: 'fa-solid fa-money-check-dollar',
    iconColor: '#404040',
    statusType: 'success'
  }
}

// 店铺详情配置
export const SHOP_DETAIL_FIELDS = [
  { key: 'code', label: '商户编号', type: 'text' },
  { key: 'agent', label: '所属代理', type: 'link' },
  { key: 'provider', label: '所属服务商', type: 'link' },
  { key: 'certStatus', label: '认证状态', type: 'tag' }
]

// 金额显示配置
export const BALANCE_FORMAT_OPTIONS = {
  currency: '¥',
  decimalPlaces: 2,
  showCurrency: true,
  hideSymbol: '****'
}
