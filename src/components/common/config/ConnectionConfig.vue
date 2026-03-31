<template>
  <div class="config-content">
    <el-alert
      title="对接配置"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 20px;"
    >
      配置系统对接参数,建立与第三方系统的连接
    </el-alert>

    <el-empty description="功能开发中,敬请期待" :image-size="200" />
  </div>
</template>

<script setup>
defineProps({
  configKey: {
    type: String,
    default: ''
  }
})

defineEmits(['close', 'refresh'])
</script>

<style scoped lang="scss">
.config-content {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
