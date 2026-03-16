<template>
  <div class="card-header">
    <div class="header-left">
      <span class="title">{{ title }}</span>
      <span v-if="updateTime" class="update-time">统计时间：{{ updateTime }}</span>
      <el-icon v-if="showRefresh" class="refresh-icon" @click="$emit('refresh')">
        <Refresh />
      </el-icon>
    </div>
    <div v-if="$slots.extra" class="header-right">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup>
import { Refresh } from '@element-plus/icons-vue'

defineProps({
  title: { type: String, required: true },
  updateTime: { type: String, default: '' },
  showRefresh: { type: Boolean, default: true }
})

defineEmits(['refresh'])
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .update-time {
      font-size: 12px;
      color: #909399;
    }

    .refresh-icon {
      cursor: pointer;
      color: #909399;

      &:hover {
        color: #409EFF;
      }
    }
  }
}
</style>
