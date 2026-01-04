<template>
  <div class="breadcrumb-container" v-if="breadcrumbList.length > 0">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="item.path"
        
      >
        {{ item.meta?.title || item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    path: item.path,
    name: item.name,
    meta: item.meta
  }))
})
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      font-size: 14px;
      
      &.is-link {
        color: #606266;
        font-weight: normal;
        
        &:hover {
          color: #1890ff;
        }
      }
    }
    
    &:last-child {
      .el-breadcrumb__inner {
        color: #303133;
        font-weight: bold;
      }
    }
  }
}
</style>