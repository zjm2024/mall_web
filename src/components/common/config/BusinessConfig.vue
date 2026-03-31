<template>
  <div class="config-content">
    <el-alert
      title="经营信息"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 20px;"
    >
      查看和编辑经营信息,包括经营范围、经营地址等
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
