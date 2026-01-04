<template>
  <div class="order-list">
    <div class="page-header">
      <h2>订单配送</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>订单配送</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="content">
      <div style="text-align: center; padding: 60px;">
        <el-icon :size="80" color="#fff7e6"><Truck /></el-icon>
        <h3 style="margin-top: 20px; color: #303133;">订单配送页面</h3>
        <p style="color: #909399;">管理订单处理和配送</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Truck } from '@element-plus/icons-vue'
</script>

<style scoped>
.order-list {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
  
  h2 {
    margin: 0 0 10px 0;
    font-size: 20px;
    color: #303133;
  }
}

.content {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  min-height: 400px;
}
</style>