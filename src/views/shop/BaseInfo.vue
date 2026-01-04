<template>
  <div class="base-info">

    
    <div class="content">
      
        <div style="text-align: center; padding: 40px;">
          <el-icon :size="60" color="#909399"><InfoFilled /></el-icon>
          <p style="margin-top: 20px; color: #909399;">基础信息页面</p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { InfoFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.base-info {
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
}
</style>