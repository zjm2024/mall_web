// 数据看板配置常量
//import
// 实时指标配置
export const REAL_TIME_METRICS_CONFIG = [
  { label: '支付金额', tooltip: '统计今日累计支付金额', icon: 'Money', value: '0.00', yesterday: '0.00' },
  { label: '商品支付金额', tooltip: '通过商品渠道支付的金额', value: '0.00', yesterday: '0.00' },
  { label: '分销支付金额', tooltip: '通过分销渠道支付的金额', value: '0.00', yesterday: '0.00' },
  { label: '余额卡支付金额', tooltip: '通过余额卡支付的金额', value: '0.00', yesterday: '0.00' },
  { label: '支付订单数', tooltip: '今日累计支付订单数量', value: '0', yesterday: '0' },
  { label: '支付买家数', tooltip: '今日累计支付买家数量', value: '0', yesterday: '0' },
  { label: '商品访客数', tooltip: '今日访问商品的访客数量', value: '0', yesterday: '0' },
  { label: '退款金额 (支付时间)', tooltip: '按支付时间统计的退款金额', value: '0.00', yesterday: '0.00' },
  { label: '退款金额 (退款时间)', tooltip: '按退款时间统计的退款金额', value: '0.00', yesterday: '0.00' }
]

// 核心指标配置
export const CORE_METRICS_CONFIG = [
  { label: '支付金额', tooltip: '统计周期内的支付总金额', value: '-', compare: '-' },
  { label: '支付订单数', tooltip: '统计周期内的支付订单数量', value: '-', compare: '-' },
  { label: '商品访客数', tooltip: '统计周期内访问商品的访客数量', value: '-', compare: '-' },
  { label: '退款金额 (支付时间)', tooltip: '按支付时间统计的退款金额', value: '-', compare: '-' },
  { label: '退款率 (支付时间)', tooltip: '按支付时间统计的退款比率', value: '-', compare: '-' },
  { label: '支付转化率', tooltip: '访客到支付的转化率', value: '-', compare: '-' },
  { label: '退款金额 (退款时间)', tooltip: '按退款时间统计的退款金额', value: '-', compare: '-' }
]

// 细分指标配置
export const SUB_METRICS_CONFIG = [
  { label: '商品支付金额', tooltip: '通过商品渠道支付的金额', value: '-', ratio: '-', compare: '-' },
  { label: '分销支付金额', tooltip: '通过分销渠道支付的金额', value: '-', ratio: '-', compare: '-' },
  { label: '商卡支付金额', tooltip: '通过余额卡支付的金额', value: '-', ratio: '-', compare: '-' }
]

// 图表X轴数据
export const CHART_X_AXIS_DATA = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
export const BUSINESS_X_AXIS_DATA = ['02-07', '02-11', '02-15', '02-19', '02-23', '02-27', '03-03', '03-07']

// 日期范围选项
export const DATE_RANGES = [
  { label: '近 1 日', value: '1day' },
  { label: '近 7 日', value: '7days' },
  { label: '近 30 日', value: '30days' }
]

// 筛选标签
export const FILTER_TABS = [
  { label: '全部', value: 'all' },
  { label: '自营', value: 'self' },
  { label: '带货', value: 'sales' }
]
