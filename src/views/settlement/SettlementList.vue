<template>
  <div class="settlement-list">
    <div class="page-header">
      <h2>资金结算</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>资金结算</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="content">
      <div style="text-align: center; padding: 60px;">
        <el-icon :size="80" color="#fff0f6"><Money /></el-icon>
        <h3 style="margin-top: 20px; color: #303133;">资金结算页面</h3>
        <p style="color: #909399;">管理资金结算和账务</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Money } from '@element-plus/icons-vue'
</script>

<style scoped>
.settlement-list {
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