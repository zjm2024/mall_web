<template>
  <el-dialog
    v-model="visible"
    :title="modalTitle"
    width="60%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 动态组件插槽 -->
    <component
      v-if="visible && currentComponent"
      :is="currentComponent"
      v-bind="{ configKey: props.configKey }"
      @close="handleClose"
      @refresh="handleRefresh"
    />
  </el-dialog>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  configKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'refresh'])

// 弹窗显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 当前弹窗标题
const modalTitle = computed(() => {
  return CONFIG_TITLES[props.configKey] || '配置'
})

// 当前动态组件
const currentComponent = computed(() => {
  return CONFIG_COMPONENTS[props.configKey]
})

/**
 * 关闭弹窗
 */
const handleClose = () => {
  visible.value = false
}

/**
 * 刷新数据
 */
const handleRefresh = () => {
  emit('refresh')
  handleClose()
}

// 配置标题映射
const CONFIG_TITLES = {
  '对接配置': '对接配置',
  '主体信息': '主体信息',
  '经营信息': '经营信息',
  '结算信息': '结算信息',
  '支付主体权': '支付主体权',
  '分账配置': '分账配置',
  '易支付配置': '易支付配置',
  '网关配置': '网关配置'
}

// 配置组件映射 - 使用异步组件
const CONFIG_COMPONENTS = {
  '对接配置': defineAsyncComponent(() => import('./config/ConnectionConfig.vue')),
  '主体信息': defineAsyncComponent(() => import('./config/MainBodyConfig.vue')),
  '经营信息': defineAsyncComponent(() => import('./config/BusinessConfig.vue')),
  '结算信息': defineAsyncComponent(() => import('./config/SettlementConfig.vue')),
  '支付主体权': defineAsyncComponent(() => import('./config/PaymentAuthorityConfig.vue')),
  '分账配置': defineAsyncComponent(() => import('./config/SplitAccountConfig.vue')),
  '易支付配置': defineAsyncComponent(() => import('./config/EasyPayConfig.vue')),
  '网关配置': defineAsyncComponent(() => import('./config/GatewayConfig.vue'))
}
</script>

<style scoped lang="scss">
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 20px;
    border-bottom: 1px solid #e4e7ed;
  }

  .el-dialog__body {
    padding: 20px;
  }
}
</style>
