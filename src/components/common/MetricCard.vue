<template>
  <div :class="['metric-card', { highlight: highlight }, size]">
    <div class="metric-header">
      <el-icon v-if="icon" class="metric-icon">
        <component :is="icon" />
      </el-icon>
      <span class="metric-label">{{ label }}</span>
      <el-tooltip v-if="tooltip" :content="tooltip" placement="top">
        <el-icon class="info-icon"><QuestionFilled /></el-icon>
      </el-tooltip>
      <el-checkbox v-if="showCheckbox" class="metric-checkbox" />
    </div>

    <div v-if="ratio !== undefined" class="metric-value-with-ratio">
      <div class="value-section">
        <span class="metric-value">{{ value }}</span>
        <span v-if="ratio" class="metric-ratio">占比 {{ ratio }}</span>
      </div>
    </div>
    <div v-else class="metric-value">{{ value }}</div>

    <div v-if="compareLabel" class="metric-compare">
      {{ compareLabel }} {{ compareValue }}
    </div>
  </div>
</template>

<script setup>
import { QuestionFilled, Plus } from '@element-plus/icons-vue'

defineProps({
  // 基础属性
  label: { type: String, required: true },
  value: { type: String, default: '-' },
  tooltip: { type: String, default: '' },
  icon: { type: String, default: '' },

  // 样式属性
  highlight: { type: Boolean, default: false },
  size: { type: String, default: 'medium', validator: (v) => ['small', 'medium', 'large'].includes(v) },

  // 对比数据
  compareLabel: { type: String, default: '' },
  compareValue: { type: String, default: '' },

  // 细分指标特有
  ratio: { type: String, default: undefined },

  // 功能开关
  showCheckbox: { type: Boolean, default: false },
  showAction: { type: Boolean, default: false }
})

defineEmits(['action'])
</script>

<style scoped lang="scss">
.metric-card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  &.highlight {
    background: linear-gradient(135deg, #e6f3ff 0%, #f0f7ff 100%);
    border-color: #409EFF;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  }

  // 尺寸变体
  &.small {
    .metric-value {
      font-size: 18px;
    }
  }

  &.large {
    .metric-value {
      font-size: 24px;
    }
  }
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;

  .metric-icon {
    color: #409EFF;
    font-size: 16px;
  }

  .metric-label {
    font-size: 13px;
    color: #606266;
    flex: 1;
  }

  .info-icon {
    color: #909399;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      color: #409EFF;
    }
  }

  .metric-checkbox {
    margin-left: auto;
  }

  .action-icon {
    color: #909399;
    cursor: pointer;

    &:hover {
      color: #409EFF;
    }
  }
}

.metric-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.metric-value-with-ratio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;

  .value-section {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .metric-value {
      margin-bottom: 0;
    }

    .metric-ratio {
      font-size: 12px;
      color: #909399;
    }
  }
}

.metric-compare {
  font-size: 12px;
  color: #909399;
}
</style>
