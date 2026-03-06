<template>
  <el-dialog
    v-model="dialogVisible"
    title="批量发货"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="batch-ship-dialog">
      <!-- 提示信息 -->
      <div class="tip-section">
        <el-alert
          title="请为每个订单填写对应的快递单号，支持批量操作"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 批量发货表格 -->
      <div class="table-section">
        <el-table
          :data="selectedOrders"
          style="width: 100%"
          max-height="300"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#303133',
            fontWeight: 'bold'
          }"
        >
          <!-- 订单编号 -->
          <el-table-column prop="orderNo" label="订单编号" min-width="120" align="center">
            <template #default="{row}">
              <div class="order-cell">
                <div class="order-no">{{ row.orderNo }}</div>
                <div class="customer-name">{{ row.receiverName }}</div>
              </div>
            </template>
          </el-table-column>

          <!-- 快递单号输入 -->
          <el-table-column label="快递单号" min-width="180" align="center">
            <template #default="{row, $index}">
                <el-input
                v-model="row.shippingNo"
                placeholder="请输入快递单号"
                size="large"
                @blur="validateshippingNo(row, $index)"
              >
                <template #prefix>
                  <el-icon>
                    <Van />
                  </el-icon>
                </template>
              </el-input>
              <div v-if="row.trackingError" class="error-tip">
                {{ row.trackingError }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 批量操作区域 -->
      <div class="batch-operations">
        <el-button @click="clearAllshippingNos" size="small" type="info">
          清空所有快递单号
        </el-button>
        <el-button @click="setDefaultExpress" size="small" type="primary">
          批量设置常用快递
        </el-button>
      </div>

      <!-- 统计信息 -->
      <div class="statistics-section">
        <div class="stat-item">
          <span class="label">选中订单数：</span>
          <span class="value">{{ selectedOrders.length }}</span>
        </div>
        <div class="stat-item">
          <span class="label">已填写快递单号：</span>
          <span class="value">{{ filledshippingNoCount }}</span>
        </div>
        <div class="stat-item">
          <span class="label">完成度：</span>
          <span class="value">{{ completionPercentage }}%</span>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel" :disabled="loading">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :disabled="!canConfirm"
          :loading="loading"
        >
          确认发货 ({{ filledshippingNoCount }})
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Van } from '@element-plus/icons-vue'
import orderApi from '@/api/modules/order'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  selectedOrders: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'success'])

// 响应式数据
const dialogVisible = ref(false)
const loading = ref(false)

// 计算属性
const selectedOrders = computed({
  get: () => {
    // 为每个订单添加追踪号码和验证状态
    return props.selectedOrders.map(order => ({
      ...order,
      shippingNo: '',
      trackingError: ''
    }))
  },
  set: (val) => val
})

  // 统计信息计算
const filledshippingNoCount = computed(() => {
  return selectedOrders.value.filter(order => 
    order.shippingNo && order.shippingNo.trim()
  ).length
})

const completionPercentage = computed(() => {
  if (selectedOrders.value.length === 0) return 0
  return Math.round((filledshippingNoCount.value / selectedOrders.value.length) * 100)
})

const canConfirm = computed(() => {
  return filledshippingNoCount.value > 0 && 
         selectedOrders.value.every(order => 
           !order.shippingNo || // 如果没填快递单号，则跳过验证
           (!order.trackingError && order.shippingNo.trim()) // 如果填了快递单号，则必须没有错误且内容非空
         )
})

  // 监听visible变化
watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
  if (!val) {
    // 关闭时重置状态
    selectedOrders.value.forEach(order => {
      order.shippingNo = ''
      order.trackingError = ''
    })
  }
})

// 验证快递单号
const validateshippingNo = (order, index) => {
  if (!order.shippingNo || !order.shippingNo.trim()) {
    order.trackingError = ''
    return
  }

  const shippingNo = order.shippingNo.trim()
  
  // 基础验证规则
  if (shippingNo.length < 6) {
    order.trackingError = '快递单号长度不能少于6位'
    return
  }
  
  if (shippingNo.length > 30) {
    order.trackingError = '快递单号长度不能超过30位'
    return
  }
  
  // 检查是否包含非法字符
  if (!/^[A-Za-z0-9\-\s\(\)]+$/.test(shippingNo)) {
    order.trackingError = '快递单号包含非法字符'
    return
  }
  
  order.trackingError = ''
}

// 清空所有快递单号
const clearAllshippingNos = () => {
  selectedOrders.value.forEach(order => {
    order.shippingNo = ''
    order.trackingError = ''
  })
}

// 设置默认快递单号（可以根据需要设置常用快递格式）
const setDefaultExpress = () => {
  selectedOrders.value.forEach((order, index) => {
    if (!order.shippingNo || !order.shippingNo.trim()) {
      // 这里可以设置为常用快递公司前缀 + 时间戳 + 序号
      const timestamp = Date.now()
      const expressCode = `YT${timestamp}${String(index + 1).padStart(3, '0')}`
      order.shippingNo = expressCode
      order.trackingError = ''
    }
  })
}

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false
}

// 确认发货
const handleConfirm = async () => {
  try {
    // 验证是否有填写的快递单号
    const filledOrders = selectedOrders.value.filter(order => 
      order.shippingNo && order.shippingNo.trim()
    )
    
    if (filledOrders.length === 0) {
      ElMessage.warning('请至少填写一个快递单号')
      return
    }

    // 检查是否有验证错误
    const hasErrors = selectedOrders.value.some(order => 
      order.trackingError && order.shippingNo
    )
    
    if (hasErrors) {
      ElMessage.error('请修正快递单号输入错误后再提交')
      return
    }

    loading.value = true

    // 准备批量发货数据
    const batchShipData = filledOrders.map(order => ({
      orderId: order.orderId,
      orderNo: order.orderNo,
      shippingNo: order.shippingNo.trim()
    }))

    // 调用批量发货API（前期实现先临时使用UPDATE接口）
    const response = await orderApi.batchShip(batchShipData)
    
    ElMessage.success(
      `批量发货成功！成功处理 ${response.successCount || filledOrders.length} 个订单`
    )
    
    // 关闭对话框并通知父组件
    dialogVisible.value = false
    emit('success', response)
    
  } catch (error) {
    console.error('批量发货失败:', error)
    ElMessage.error(error.message || '批量发货失败，请重试')
  } finally {
    loading.value = false
  }
}

// 暴露方法给父组件使用
const openDialog = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
}

defineExpose({
  openDialog,
  closeDialog
})
</script>

<style lang="scss" scoped>
.batch-ship-dialog {
  .tip-section {
    margin-bottom: 20px;
  }

  .table-section {
    margin-bottom: 16px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: hidden;

    .order-cell {
      .order-no {
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }
      
      .customer-name {
        font-size: 12px;
        color: #606266;
      }
    }

    .error-tip {
      color: #f56c6c;
      font-size: 12px;
      margin-top: 4px;
    }
  }

  .batch-operations {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .statistics-section {
    display: flex;
    justify-content: space-around;
    padding: 12px;
    background: #f0f9ff;
    border-radius: 4px;
    margin-bottom: 20px;

    .stat-item {
      text-align: center;

      .label {
        font-size: 14px;
        color: #606266;
      }

      .value {
        font-size: 16px;
        font-weight: 600;
        color: #409eff;
        margin-left: 8px;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>