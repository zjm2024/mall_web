<template>
  <div class="config-content">
    <el-alert
      title="结算信息"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 20px;"
    >
      配置结算账户信息,管理收款账户和结算周期
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
