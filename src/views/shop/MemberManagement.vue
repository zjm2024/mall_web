<template>
  <div class="member-management">
    <div class="page-header">
      <h2>成员管理</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
        <el-breadcrumb-item>成员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="content">
      <div style="text-align: center; padding: 60px;">
        <el-icon :size="80" color="#e6f7ff"><User /></el-icon>
        <h3 style="margin-top: 20px; color: #303133;">成员管理页面</h3>
        <p style="color: #909399;">管理店铺成员信息</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'
</script>

<style scoped>
.member-management {
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