<template>
  <div class="data-dashboard">
    <!-- 实时总览 -->
    <el-card class="real-time-card" shadow="never">
      <CardHeader title="实时总览" :update-time="currentTime" @refresh="refreshData">
        <template #extra>
          <el-button size="small" @click="testDynamicYAxis">测试Y轴动态调整</el-button>
        </template>
      </CardHeader>

      <div class="real-time-content">
        <!-- 核心指标卡片 -->
        <div class="metrics-grid">
          <MetricCard
            v-for="(metric, index) in realTimeMetrics"
            :key="index"
            :label="metric.label"
            :value="metric.value"
            :tooltip="metric.tooltip"
            :icon="metric.icon"
            :highlight="metric.highlight"
            compare-label="昨日"
            :compare-value="metric.yesterday"
            size="large"
          />
        </div>

        <!-- 分时趋势图 -->
        <div class="trend-chart">
          <div class="chart-toggle">
            <el-button-group>
              <el-button
                size="small"
                :type="chartType === 'trend' ? 'primary' : ''"
                @click="chartType = 'trend'"
              >分时段趋势图</el-button>
              <el-button
                size="small"
                :type="chartType === 'cumulative' ? 'primary' : ''"
                @click="chartType = 'cumulative'"
              >分时段累计图</el-button>
            </el-button-group>
          </div>
          <div ref="realTimeChartRef" class="chart-container"></div>
        </div>
      </div>
    </el-card>

    <!-- 经营数据概览 -->
    <el-card class="business-card" shadow="never">
      <CardHeader title="经营数据概览" :update-time="dateRange">
        <template #extra>
          <div class="date-range-selector">
            <el-button
              v-for="range in dateRanges"
              :key="range.value"
              size="small"
              :type="selectedDateRange === range.value ? 'primary' : ''"
              @click="selectedDateRange = range.value"
            >
              {{ range.label }}
            </el-button>
            <el-button size="small">日</el-button>
            <el-button size="small">周</el-button>
            <el-button size="small">月</el-button>
            <el-button size="small">
              自定义
              <el-icon><QuestionFilled /></el-icon>
            </el-button>
          </div>
        </template>
      </CardHeader>

      <!-- 核心数据概览 -->
      <div class="core-metrics-section">
        <div class="metrics-header">
          <div class="left-section">
            <span class="section-title">核心数据指标</span>
            <el-button type="primary" link>查看更多数据</el-button>
          </div>
          <div class="right-section">
            <el-button size="small">
              <el-icon><Setting /></el-icon>
              更多指标
            </el-button>
            <el-button size="small">下载页面数据</el-button>
            <el-button size="small">下载全部数据</el-button>
          </div>
        </div>

        <!-- 指标筛选 -->
        <div class="filter-tabs">
          <el-button
            v-for="tab in filterTabs"
            :key="tab.value"
            size="small"
            :type="selectedTab === tab.value ? 'primary' : ''"
            @click="selectedTab = tab.value"
          >
            {{ tab.label }}
          </el-button>
        </div>

        <!-- 核心指标卡片 -->
        <div class="core-metrics-grid">
          <MetricCard
            v-for="(metric, index) in coreMetrics"
            :key="index"
            :label="metric.label"
            :value="metric.value"
            :tooltip="metric.tooltip"
            :highlight="metric.highlight"
            compare-label="较前 30 日"
            :compare-value="metric.compare"
          />
        </div>

        <!-- 细分指标卡片 -->
        <div class="sub-metrics-grid">
          <MetricCard
            v-for="(metric, index) in subMetrics"
            :key="index"
            :label="metric.label"
            :value="metric.value"
            :tooltip="metric.tooltip"
            :ratio="metric.ratio"
            compare-label="较前 30 日"
            :compare-value="metric.compare"
            show-checkbox
            show-action
          />
        </div>

        <!-- 趋势图表 -->
        <div class="trend-chart-section">
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot"></span>
              <span class="legend-label">支付金额</span>
            </div>
          </div>
          <div ref="businessChartRef" class="business-chart-container"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { QuestionFilled, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 导入提取的模块
import MetricCard from '@/components/common/MetricCard.vue'
import CardHeader from './components/CardHeader.vue'
import { useDashboardChart } from '@/composables/useDashboardChart'
import { formatTime, generateMockData, calculateYAxisMax } from '@/utils/dashboard'
import {
  REAL_TIME_METRICS_CONFIG,
  CORE_METRICS_CONFIG,
  SUB_METRICS_CONFIG,
  DATE_RANGES,
  FILTER_TABS,
  CHART_X_AXIS_DATA,
  BUSINESS_X_AXIS_DATA
} from '@/constants/dashboardset'

// ==================== 响应式数据 ====================
const currentTime = ref('')
const dateRange = ref('2026-02-07~2026-03-08')
const chartType = ref('trend')
const selectedDateRange = ref('30days')
const selectedTab = ref('all')

// 指标数据
const realTimeMetrics = ref(REAL_TIME_METRICS_CONFIG.map(m => ({ ...m })))
const coreMetrics = ref(CORE_METRICS_CONFIG.map(m => ({ ...m })))
const subMetrics = ref(SUB_METRICS_CONFIG.map(m => ({ ...m })))

// 使用图表 composable
const {
  realTimeChartRef,
  businessChartRef,
  refreshChartData,
  updateChartData
} = useDashboardChart()

// ==================== 业务逻辑 ====================
const updateTime = () => {
  currentTime.value = formatTime(new Date())
}

const refreshData = () => {
  updateTime()
  refreshChartData()
  ElMessage.success('数据已刷新')
}

// Y轴动态调整测试
const testDynamicYAxis = () => {
  const testCases = [
    { name: '小数据范围', maxValue: 1000 },
    { name: '中等数据范围', maxValue: 5000 },
    { name: '大数据范围', maxValue: 20000 },
    { name: '极大数据范围', maxValue: 100000 }
  ]

  let currentTestCase = 0

  const runNextTest = () => {
    if (currentTestCase >= testCases.length) {
      ElMessage.success('Y轴动态调整测试完成！')
      return
    }

    const testCase = testCases[currentTestCase]
    const newData = generateMockData(CHART_X_AXIS_DATA.length, testCase.maxValue)
    const dataMax = Math.max(...newData)
    const yAxisMax = calculateYAxisMax(newData)

    updateChartData('realTime', newData)

    ElMessage.info(
      `测试用例 ${currentTestCase + 1}: ${testCase.name}\n` +
      `数据最大值: ${dataMax.toFixed(2)}\n` +
      `Y轴最大值: ${yAxisMax.toFixed(2)}\n` +
      `缓冲空间: ${(yAxisMax - dataMax).toFixed(2)} (${((yAxisMax - dataMax) / dataMax * 100).toFixed(1)}%)`
    )

    currentTestCase++
    if (currentTestCase < testCases.length) {
      setTimeout(runNextTest, 3000)
    }
  }

  ElMessage.success('开始Y轴动态调整测试...')
  runNextTest()
}

// ==================== 生命周期 ====================
onMounted(() => {
  updateTime()
})
</script>

<style scoped lang="scss">
.data-dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 84px);
}

:deep(.el-card) {
  border: none;
  border-radius: 8px;
  margin-bottom: 20px;

  .el-card__body {
    padding: 20px;
  }
}

// 实时总览样式
.real-time-content {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 20px;

  @media (max-width: 1400px) {
    grid-template-columns: 1fr;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.trend-chart {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e4e7ed;

  .chart-toggle {
    margin-bottom: 16px;
  }

  .chart-container {
    width: 100%;
    height: 300px;
  }
}

// 经营数据概览样式
.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .left-section {
    display: flex;
    align-items: center;
    gap: 8px;

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }

  .right-section {
    display: flex;
    gap: 8px;
  }
}

.filter-tabs {
  margin-bottom: 20px;
  display: flex;
  gap: 8px;
}

.date-range-selector {
  display: flex;
  gap: 8px;
}

.core-metrics-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.sub-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

.trend-chart-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e4e7ed;

  .chart-legend {
    margin-bottom: 16px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #409EFF;
      }

      .legend-label {
        font-size: 13px;
        color: #606266;
      }
    }
  }

  .business-chart-container {
    width: 100%;
    height: 300px;
  }
}
</style>
