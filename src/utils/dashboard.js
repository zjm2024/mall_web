import * as echarts from 'echarts'

/**
 * 格式化时间
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * 格式化Y轴标签
 * @param {number} value - 数值
 * @returns {string} 格式化后的标签
 */
export const formatYAxisLabel = (value) => {
  if (value === 0) return '0'
  if (value >= 10000) return `${(value / 10000).toFixed(0)}万`
  return value.toString()
}

/**
 * 动态计算y轴最大值
 * @param {Array} data - 图表数据数组
 * @param {number} bufferRatio - 缓冲比例，默认为0.2（20%）
 * @returns {number} 计算后的y轴最大值
 */
export const calculateYAxisMax = (data, bufferRatio = 0.2) => {
  if (!data || data.length === 0) return 1

  const maxValue = Math.max(...data)
  if (maxValue === 0) return 1

  const buffer = maxValue * bufferRatio
  return maxValue + buffer
}

/**
 * 生成模拟数据用于测试
 * @param {number} length - 数据长度
 * @param {number} maxValue - 最大值范围
 * @returns {Array} 模拟数据数组
 */
export const generateMockData = (length, maxValue = 10000) => {
  return Array.from({ length }, () => Math.floor(Math.random() * maxValue))
}

/**
 * 创建图表配置选项
 * @param {Array} xAxisData - X轴数据
 * @param {Array} chartData - 图表数据
 * @param {string} seriesName - 系列名称
 * @returns {Object} ECharts配置选项
 */
export const createChartOption = (xAxisData, chartData = [], seriesName = '支付金额') => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: xAxisData.length > 6 ? 'cross' : 'line' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: xAxisData.length > 6 ? '15%' : '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxisData,
    axisLine: { lineStyle: { color: '#e8e8e8' } },
    axisLabel: { color: '#999' }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: calculateYAxisMax(chartData),
    splitLine: {
      lineStyle: { color: '#f0f0f0', type: 'dashed' }
    },
    axisLabel: {
      color: '#999',
      formatter: formatYAxisLabel
    }
  },
  series: [{
    name: seriesName,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    itemStyle: { color: '#409EFF' },
    lineStyle: { width: 2, color: '#409EFF' },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
        { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
      ])
    },
    data: chartData.length > 0 ? chartData : Array(xAxisData.length).fill(0)
  }]
})
