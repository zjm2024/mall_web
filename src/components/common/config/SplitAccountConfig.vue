<template>
  <div class="config-content">
    <el-alert
      title="分账配置"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 20px;"
    >
      配置分账规则,将订单金额按比例分配到不同账户
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
