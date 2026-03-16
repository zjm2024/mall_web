import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { createChartOption, generateMockData } from '@/utils/dashboard'
import { CHART_X_AXIS_DATA, BUSINESS_X_AXIS_DATA } from '@/constants/dashboardset'

/**
 * 数据看板图表逻辑 Composable
 * @returns {Object} 图表相关方法和状态
 */
export function useDashboardChart() {
  // 图表引用
  const realTimeChartRef = ref(null)
  const businessChartRef = ref(null)

  // 图表实例
  let realTimeChart = null
  let businessChart = null

  // 图表数据
  const realTimeChartData = ref(generateMockData(CHART_X_AXIS_DATA.length, 8000))
  const businessChartData = ref(generateMockData(BUSINESS_X_AXIS_DATA.length, 50000))

  /**
   * 初始化图表
   */
  const initCharts = () => {
    nextTick(() => {
      if (realTimeChartRef.value) {
        realTimeChart = echarts.init(realTimeChartRef.value)
        realTimeChart.setOption(createChartOption(CHART_X_AXIS_DATA, realTimeChartData.value, '支付金额'))
      }

      if (businessChartRef.value) {
        businessChart = echarts.init(businessChartRef.value)
        businessChart.setOption(createChartOption(BUSINESS_X_AXIS_DATA, businessChartData.value, '支付金额'))
      }
    })
  }

  /**
   * 更新图表数据
   * @param {string} chartType - 图表类型：'realTime' 或 'business'
   * @param {Array} newData - 新的图表数据
   */
  const updateChartData = (chartType, newData) => {
    if (chartType === 'realTime') {
      realTimeChartData.value = newData
      if (realTimeChart) {
        realTimeChart.setOption(createChartOption(CHART_X_AXIS_DATA, newData, '支付金额'))
      }
    } else if (chartType === 'business') {
      businessChartData.value = newData
      if (businessChart) {
        businessChart.setOption(createChartOption(BUSINESS_X_AXIS_DATA, newData, '支付金额'))
      }
    }
  }

  /**
   * 刷新图表数据
   */
  const refreshChartData = () => {
    const newRealTimeData = generateMockData(CHART_X_AXIS_DATA.length, 8000)
    const newBusinessData = generateMockData(BUSINESS_X_AXIS_DATA.length, 50000)

    updateChartData('realTime', newRealTimeData)
    updateChartData('business', newBusinessData)
  }

  /**
   * 处理窗口大小变化
   */
  const handleResize = () => {
    realTimeChart?.resize()
    businessChart?.resize()
  }

  /**
   * 销毁图表实例
   */
  const disposeCharts = () => {
    realTimeChart?.dispose()
    businessChart?.dispose()
    realTimeChart = null
    businessChart = null
  }

  // 生命周期
  onMounted(() => {
    initCharts()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    disposeCharts()
  })

  return {
    // 引用
    realTimeChartRef,
    businessChartRef,
    // 数据
    realTimeChartData,
    businessChartData,
    // 方法
    initCharts,
    updateChartData,
    refreshChartData,
    handleResize,
    disposeCharts
  }
}
