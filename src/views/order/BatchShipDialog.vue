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
                <div class="order-no">{{ row.subOrderNo }}</div>
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
        <el-button @click="downloadTemplate" size="small" type="success" :icon="Download">
          下载导入模板
        </el-button>
        <el-upload
          :before-upload="handleBeforeUpload"
          :show-file-list="false"
          accept=".xlsx,.xls"
        >
          <el-button size="small" type="primary" :icon="Upload">
            批量导入快递信息
          </el-button>
        </el-upload>
      </div>

      <!-- 导入说明 -->
      <div class="import-tip" v-if="selectedOrders.length > 0">
        <el-alert
          title="导入说明：Excel文件中订单号需要与当前选中订单一致，程序会自动匹配并填充快递单号（支持乱序导入）"
          type="warning"
          :closable="false"
          show-icon
        />
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
import { Van, Upload, Download } from '@element-plus/icons-vue'
import orderApi from '@/api/modules/order'
import * as XLSX from 'xlsx'

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
const localOrders = ref([])

// 监听props变化，初始化本地订单数据
watch(() => props.selectedOrders, (newOrders) => {
  localOrders.value = newOrders.map(order => ({
    ...order,
    shippingNo: '',
    trackingError: ''
  }))
}, { immediate: true })

// 计算属性
const selectedOrders = computed(() => localOrders.value)

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
  // 至少有一个已填写的快递单号
  if (filledshippingNoCount.value === 0) return false
  
  // 检查所有已填写的快递单号是否都没有错误
  return selectedOrders.value.every(order => {
    // 如果这个订单没有快递单号，跳过验证
    if (!order.shippingNo || !order.shippingNo.trim()) return true
    
    // 如果这个订单有快递单号，检查是否有错误
    return !order.trackingError && order.shippingNo.trim().length > 0
  })
})

  // 监听visible变化
watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
  if (!val) {
    // 关闭时重置状态
    localOrders.value = localOrders.value.map(order => ({
      ...order,
      shippingNo: '',
      trackingError: ''
    }))
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
  localOrders.value = localOrders.value.map(order => ({
    ...order,
    shippingNo: '',
    trackingError: ''
  }))
}

// 下载导入模板
const downloadTemplate = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请先选择订单')
    return
  }

  // 创建模板数据，按订单号排序保持一致性和可读性
  const sortedOrders = [...selectedOrders.value].sort((a, b) => a.orderNo.localeCompare(b.orderNo))
  const templateData = sortedOrders.map(order => ({
    '订单号': order.orderNo,
    '快递单号': ''
  }))

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(templateData, {
    header: ['订单号', '快递单号']
  })
  
  // 设置列宽
  ws['!cols'] = [
    { wch: 25 }, // 订单号列宽
    { wch: 25 }  // 快递单号列宽
  ]
  
  // 设置表头样式（如果支持）
  if (ws['A1']) ws['A1'].s = { font: { bold: true } }
  if (ws['B1']) ws['B1'].s = { font: { bold: true } }
  
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '快递单号导入模板')
  
  // 保存文件
  const timestamp = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `快递单号导入模板_${selectedOrders.value.length}个订单_${timestamp}.xlsx`)
  
  ElMessage.success('模板下载成功，请保持订单号不变，只填写快递单号列')
}

// Excel文件上传前处理
const handleBeforeUpload = (file) => {
  const fileReader = new FileReader()
  fileReader.onload = (e) => {
    try {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      processImportData(jsonData)
    } catch (error) {
      console.error('Excel导入失败:', error)
      ElMessage.error('Excel文件格式错误，请检查后重试')
    }
  }
  
  fileReader.readAsArrayBuffer(file)
  return false // 阻止自动上传
}

// 处理导入的数据
const processImportData = (importData) => {
  if (!Array.isArray(importData) || importData.length === 0) {
    ElMessage.error('导入的数据为空')
    return
  }

  // 验证数据结构
  const firstRow = importData[0]
  if (!firstRow.hasOwnProperty('订单号') || !firstRow.hasOwnProperty('快递单号')) {
    ElMessage.error('Excel文件格式错误，请确保包含"订单号"和"快递单号"两列')
    return
  }

  // 获取当前所有选中订单的订单号集合，用于验证导入的订单号是否都在选中范围内
  const currentOrderNos = new Set(selectedOrders.value.map(order => order.orderNo))
  
  // 创建导入数据映射，以订单号为key，确保乱序也能正确对应
  const importMap = new Map()
  const validImportData = []
  const invalidImportData = []
  
  importData.forEach((row, index) => {
    const orderNo = row['订单号']
    const shippingNo = row['快递单号']
    
    if (orderNo && shippingNo) {
      const orderNoStr = orderNo.toString().trim()
      const shippingNoStr = shippingNo.toString().trim()
      
      // 验证订单号是否在选中范围内
      if (currentOrderNos.has(orderNoStr)) {
        importMap.set(orderNoStr, shippingNoStr)
        validImportData.push({ orderNo: orderNoStr, shippingNo: shippingNoStr })
      } else {
        invalidImportData.push({ 
          row: index + 2, // Excel行号从2开始（第1行为表头）
          orderNo: orderNoStr, 
          reason: '订单号不在当前选中范围内'
        })
      }
    }
  })

  // 报告无效数据
  if (invalidImportData.length > 0) {
    console.warn('Excel中存在无效数据:', invalidImportData)
  }

  if (importMap.size === 0) {
    ElMessage.error('导入失败：未找到有效的订单号和快递单号对应关系，请检查Excel中的订单号是否与当前选中订单匹配')
    return
  }

  // 创建日志用于跟踪更新过程
  const updateLog = {
    matched: 0,
    updated: 0,
    skipped: 0,
    unmatched: []
  }

  // 更新本地订单数据 - 无论Excel中的顺序如何，都能确保正确对应
  localOrders.value = localOrders.value.map(order => {
    // 查找当前订单是否有对应的快递单号（通过订单号精确匹配）
    const shippingNo = importMap.get(order.orderNo)
    
    if (shippingNo) {
      updateLog.matched++
      
      // 验证快递单号格式
      const tempOrder = { ...order, shippingNo }
      validateshippingNo(tempOrder, 0) // 使用现有的验证函数
      
      if (!tempOrder.trackingError) {
        updateLog.updated++
        return {
          ...order,
          shippingNo: shippingNo,
          trackingError: ''
        }
      } else {
        updateLog.skipped++
        return order
      }
    } else {
      // 记录未匹配到的订单
      updateLog.unmatched.push(order.orderNo)
      return order
    }
  })

  // 提供详细的导入结果反馈
  let successMessage = `导入完成！成功匹配 ${updateLog.matched} 个订单，更新 ${updateLog.updated} 个快递单号`
  
  if (updateLog.skipped > 0) {
    successMessage += `，${updateLog.skipped} 个因格式验证失败跳过`
  }
  
  if (updateLog.unmatched.length > 0) {
    successMessage += `，${updateLog.unmatched.length} 个订单未在Excel中找到对应数据`
  }
  
  ElMessage.success(successMessage)
  
  // 如果有跳过或未匹配的情况，提供额外提示
  if (updateLog.skipped > 0) {
    ElMessage.warning(`有 ${updateLog.skipped} 个快递单号因格式验证失败而跳过`)
  }
  
  if (updateLog.unmatched.length > 0) {
    ElMessage.info(`以下订单未在Excel中找到：${updateLog.unmatched.slice(0, 5).join(', ')}${updateLog.unmatched.length > 5 ? '...' : ''}`)
  }
  
  // 如果有无效数据，也给出提示
  if (invalidImportData.length > 0) {
    ElMessage.warning(`Excel中包含 ${invalidImportData.length} 个不在当前选中范围内的订单号，已忽略`)
  }
}
  
  // 取消操作
const handleCancel = () => {
  dialogVisible.value = false
}

// 确认发货
const handleConfirm = async () => {
  try {
    // 验证是否有填写的快递单号
    const filledOrders = localOrders.value.filter(order => 
      order.shippingNo && order.shippingNo.trim()
    )
    
    if (filledOrders.length === 0) {
      ElMessage.warning('请至少填写一个快递单号')
      return
    }

    // 检查是否有验证错误
    const hasErrors = localOrders.value.some(order => 
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

  .import-tip {
    margin-bottom: 16px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>