<template>
  <div class="config-item" @click="handleClick">
    <div class="item-icon">
      <el-icon :size="iconSize">
        <component :is="config.icon" />
      </el-icon>
    </div>
    <div class="item-label">{{ config.label }}</div>
    <el-tooltip v-if="config.tooltip" :content="config.tooltip" placement="top">
      <el-icon class="info-icon"><QuestionFilled /></el-icon>
    </el-tooltip>
  </div>
</template>

<script setup>
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  config: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.icon && value.label
    }
  },
  iconSize: {
    type: Number,
    default: 32
  }
})

const emit = defineEmits(['click'])

/**
 * 处理配置项点击
 */
const handleClick = () => {
  emit('click', props.config)
}
</script>

<style scoped lang="scss">
.config-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    background: #f5f7fa;
    border-color: #409EFF;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);

    .item-icon {
      transform: scale(1.1);
      color: #409EFF;
    }

    .item-label {
      color: #409EFF;
      font-weight: 500;
    }
  }

  .item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    color: #606266;
  }

  .item-label {
    font-size: 14px;
    color: #606266;
    text-align: center;
    transition: all 0.3s;
  }

  .info-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #C0C4CC;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      color: #409EFF;
    }
  }
}
</style>
