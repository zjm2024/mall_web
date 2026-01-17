<template>
  <el-dialog v-model="isShowDialog" title="订单详情" draggable width="900px" :close-on-click-modal="true"
    @closed="handleClosed">
    <div v-loading="loading" class="order-detail-container">
      <!-- 基础信息卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Document /></el-icon>
            <span>基础信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="订单编号" label-class-name="desc-label">
            <span class="order-no">{{ orderData.orderNo || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getOrderStatusType(orderData.orderStatus)" size="large">
              {{ getOrderStatusText(orderData.orderStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付状态">
            <el-tag :type="getPayStatusType(orderData.payStatus)" size="large">
              {{ getPayStatusText(orderData.payStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="商户ID">
            {{ orderData.businessId || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="买家ID">
            {{ orderData.personalID || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="活动类型">
            {{ getActivityTypeText(orderData.activityType) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(orderData.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(orderData.updateTime) }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 金额信息卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Coin /></el-icon>
            <span>金额信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="订单总金额" label-class-name="desc-label">
            <span class="amount-price">¥{{ orderData.totalAmount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实际支付金额" label-class-name="desc-label">
            <span class="pay-amount-price">¥{{ orderData.totalPayAmount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="优惠金额" label-class-name="desc-label">
            <span class="discount-amount">-¥{{ getDiscountAmount() }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ getPaymentMethodText(orderData.paymentMethod) }}
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelType(orderData.riskLevel)" size="large">
              {{ getRiskLevelText(orderData.riskLevel) }}
            </el-tag>
            <br>
            {{'暂无风险原因' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 收货信息卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Location /></el-icon>
            <span>收货信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="收货人">
            {{ orderData.receiverName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ orderData.receiverPhone || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">
            {{ orderData.receiverAddress || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 物流信息卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Van /></el-icon>
            <span>物流信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="物流单号">
            {{ orderData.shippingNo || '未发货' }}
          </el-descriptions-item>
          <el-descriptions-item label="发货状态">
            <el-tag v-if="orderData.shippingNo" type="success" size="large">已发货</el-tag>
            <el-tag v-else type="warning" size="large">待发货</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 备注信息卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><ChatDotRound /></el-icon>
            <span>备注信息</span>
          </div>
        </template>
        <div class="remark-content">
          {{ orderData.remark || '暂无备注' }}
        </div>
      </el-card>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" size="large" style="width: 120px;">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Document, Coin, Location, Van, ChatDotRound } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/common'
import orderApi from '@/api/modules/order'
import {
  getOrderStatusText,
  getOrderStatusType,
  getPayStatusText,
  getPayStatusType,
  getRiskLevelText,
  getRiskLevelType,
  getPaymentMethodText,
  getActivityTypeText
} from '@/constants/order'

const isShowDialog = ref(false)
const loading = ref(false)

// 订单详情数据
const orderData = reactive({
  orderId: null,
  orderNo: '',
  personalID: '',
  businessId: '',
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  totalAmount: 0,
  totalPayAmount: 0,
  orderStatus: 0,
  payStatus: 0,
  paymentMethod: 0,
  riskLevel: 0,
  activityType: 0,
  shippingNo: '',
  remark: '',
  createTime: '',
  updateTime: ''
})

/**
 * 计算优惠金额
 */
const getDiscountAmount = () => {
  const totalAmount = parseFloat(orderData.totalAmount) || 0
  const payAmount = parseFloat(orderData.totalPayAmount) || 0
  return (totalAmount - payAmount).toFixed(2)
}


/**
 * 打开详情弹窗
 */
const openDialog = async (row) => {
  try {
    loading.value = true
    isShowDialog.value = true
    
    // 处理字段名大小写不一致的问题，参考OrderDealDialog.vue的方法
    const standardizedData = {}
    Object.keys(row).forEach(key => {
      if (key.charAt(0) === key.charAt(0).toUpperCase()) {
        // 保留原有字段名
        standardizedData[key] = row[key]
      } else if (row[key.toUpperCase()] !== undefined) {
        // 尝试大写字段名
        standardizedData[key.toUpperCase()] = row[key.toUpperCase()]
      } else {
        standardizedData[key] = row[key]
      }
    })
    
    // 使用Object.assign而不是直接赋值，保持响应性
    Object.assign(orderData, standardizedData)
  } catch (error) {
    console.error('获取订单详情失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
  isShowDialog.value = false
}

/**
 * 弹窗关闭回调
 */
const handleClosed = () => {
  // 清空数据
  Object.assign(orderData, {
    orderId: null,
    orderNo: '',
    personalID: '',
    businessId: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    totalAmount: 0,
    totalPayAmount: 0,
    orderStatus: 0,
    payStatus: 0,
    paymentMethod: 0,
    riskLevel: 0,
    activityType: 0,
    shippingNo: '',
    remark: '',
    createTime: '',
    updateTime: ''
  })
}

// 暴露方法给父组件
defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.order-detail-container {
  .detail-card {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 16px;
      color: #303133;
    }

    .desc-label {
      background-color: #f5f7fa;
      font-weight: 600;
      color: #606266;
    }

    :deep(.el-descriptions__label) {
      font-weight: 500;
      color: #606266;
    }

    :deep(.el-descriptions__content) {
      color: #303133;
    }

    .order-no {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      color: #409EFF;
      font-weight: 600;
    }

    .amount-price {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .pay-amount-price {
      font-size: 18px;
      font-weight: 700;
      color: #F56C6C;
    }

    .discount-amount {
      font-size: 16px;
      font-weight: 600;
      color: #67C23A;
    }
  }

  .remark-content {
    padding: 12px 0;
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    min-height: 40px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
