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
            <span class="order-no">{{ orderData.OrderNo || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(orderData.OrderStatus)" size="large">
              {{ getStatusText(orderData.OrderStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付状态">
            <el-tag :type="getPayStatusType(orderData.PayStatus)" size="large">
              {{ getPayStatusText(orderData.PayStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="商户ID">
            {{ orderData.BusinessId || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="买家ID">
            {{ orderData.PersonalID || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="活动类型">
            {{ getActivityTypeText(orderData.ActivityType) }}
          </el-descriptions-item>
          <el-descriptions-item label="应用类型">
            {{ getAppTypeText(orderData.AppType) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(orderData.CreateTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(orderData.UpdateTime) }}
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
            <span class="amount-price">¥{{ orderData.TotalAmount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实际支付金额" label-class-name="desc-label">
            <span class="pay-amount-price">¥{{ orderData.TotalPayAmount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="优惠金额" label-class-name="desc-label">
            <span class="discount-amount">-¥{{ getDiscountAmount() }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ getPaymentMethodText(orderData.PaymentMethod) }}
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelType(orderData.RiskLevel)" size="large">
              {{ getRiskLevelText(orderData.RiskLevel) }}
            </el-tag>
            <br>
            {{orderData.RiskReason || '-' }}
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
            {{ orderData.ReceiverName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ orderData.ReceiverPhone || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">
            {{ orderData.ReceiverAddress || '-' }}
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
            {{ orderData.ShippingNo || '未发货' }}
          </el-descriptions-item>
          <el-descriptions-item label="发货状态">
            <el-tag v-if="orderData.ShippingNo" type="success" size="large">已发货</el-tag>
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
          {{ orderData.Remark || '暂无备注' }}
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
  OrderStatus,
  PayStatus,
  RiskLevel,
  PaymentMethod,
  ActivityType,
  AppType
} from '@/constants/order'

const isShowDialog = ref(false)
const loading = ref(false)

// 订单详情数据
const orderData = reactive({
  OrderId: null,
  OrderNo: '',
  PersonalID: '',
  BusinessId: '',
  ReceiverName: '',
  ReceiverPhone: '',
  ReceiverAddress: '',
  TotalAmount: 0,
  TotalPayAmount: 0,
  OrderStatus: 0,
  PayStatus: 0,
  PaymentMethod: 0,
  RiskLevel: 0,
  ActivityType: 0,
  AppType: 1,
  ShippingNo: '',
  Remark: '',
  CreateTime: '',
  UpdateTime: ''
})

/**
 * 计算优惠金额
 */
const getDiscountAmount = () => {
  const totalAmount = parseFloat(orderData.TotalAmount) || 0
  const payAmount = parseFloat(orderData.TotalPayAmount) || 0
  return (totalAmount - payAmount).toFixed(2)
}

/**
 * 获取订单状态文本
 */
const getStatusText = (status) => {
  const statusMap = {
    [OrderStatus.PENDING]: '待处理',
    [OrderStatus.SHIPPED]: '已发货',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.CLOSED]: '已关闭'
  }
  return statusMap[status] || '未知'
}

/**
 * 获取订单状态类型
 */
const getStatusType = (status) => {
  const typeMap = {
    [OrderStatus.PENDING]: 'warning',
    [OrderStatus.SHIPPED]: 'primary',
    [OrderStatus.COMPLETED]: 'success',
    [OrderStatus.CLOSED]: 'info'
  }
  return typeMap[status] || 'info'
}

/**
 * 获取支付状态文本
 */
const getPayStatusText = (status) => {
  const statusMap = {
    [PayStatus.UNPAID]: '待支付',
    [PayStatus.PAID]: '已支付',
    [PayStatus.CANCELLED]: '已取消'
  }
  return statusMap[status] || '未知'
}

/**
 * 获取支付状态类型
 */
const getPayStatusType = (status) => {
  const typeMap = {
    [PayStatus.UNPAID]: 'warning',
    [PayStatus.PAID]: 'success',
    [PayStatus.CANCELLED]: 'info'
  }
  return typeMap[status] || 'info'
}

/**
 * 获取支付方式文本
 */
const getPaymentMethodText = (method) => {
  const methodMap = {
    [PaymentMethod.WECHAT]: '微信',
    [PaymentMethod.BALANCE]: '余额',
    [PaymentMethod.MIXED]: '混合'
  }
  return methodMap[method] || '-'
}

/**
 * 获取风险等级文本
 */
const getRiskLevelText = (level) => {
  const levelMap = {
    [RiskLevel.NORMAL]: '正常',
    [RiskLevel.SUSPICIOUS]: '可疑',
    [RiskLevel.HIGH]: '高风险'
  }
  return levelMap[level] || '-'
}

/**
 * 获取风险等级类型
 */
const getRiskLevelType = (level) => {
  const typeMap = {
    [RiskLevel.NORMAL]: 'success',
    [RiskLevel.SUSPICIOUS]: 'warning',
    [RiskLevel.HIGH]: 'danger'
  }
  return typeMap[level] || 'info'
}

/**
 * 获取活动类型文本
 */
const getActivityTypeText = (type) => {
  const typeMap = {
    [ActivityType.NORMAL]: '普通订单',
    [ActivityType.SECKILL]: '秒杀活动',
    [ActivityType.GROUP]: '团购活动'
  }
  return typeMap[type] || '-'
}

/**
 * 获取应用类型文本
 */
const getAppTypeText = (type) => {
  const typeMap = {
    [AppType.WECHAT]: '微信小程序',
    [AppType.APP]: 'APP',
    [AppType.H5]: 'H5'
  }
  return typeMap[type] || '-'
}

/**
 * 打开详情弹窗
 */
const openDialog = async (row) => {
  try {
    loading.value = true
    isShowDialog.value = true

    // 如果传入了订单数据，直接显示
    if (row && (row.OrderId || row.OrderNo)) {
      // 处理字段名大小写不一致的问题
      Object.assign(orderData, {
        OrderId: row.OrderId || row.OrderId,
        OrderNo: row.OrderNo || row.orderNo || '',
        PersonalID: row.PersonalID || row.personalId || '',
        BusinessId: row.BusinessId || row.businessId || '',
        ReceiverName: row.ReceiverName || row.receiverName || '',
        ReceiverPhone: row.ReceiverPhone || row.receiverPhone || '',
        ReceiverAddress: row.ReceiverAddress || row.receiverAddress || '',
        TotalAmount: row.TotalAmount || row.totalAmount || 0,
        TotalPayAmount: row.TotalPayAmount || row.totalPayAmount || 0,
        OrderStatus: row.OrderStatus || row.orderStatus || 0,
        PayStatus: row.PayStatus || row.payStatus || 0,
        PaymentMethod: row.PaymentMethod || row.paymentMethod || 0,
        RiskLevel: row.RiskLevel || row.riskLevel || 0,
        ActivityType: row.ActivityType || row.activityType || 0,
        AppType: row.AppType || row.appType || 1,
        ShippingNo: row.ShippingNo || row.shippingNo || '',
        Remark: row.Remark || row.remark || '',
        CreateTime: row.CreateTime || row.createTime || '',
        UpdateTime: row.UpdateTime || row.updateTime || ''
      })
    }
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
    OrderId: null,
    OrderNo: '',
    PersonalID: '',
    BusinessId: '',
    ReceiverName: '',
    ReceiverPhone: '',
    ReceiverAddress: '',
    TotalAmount: 0,
    TotalPayAmount: 0,
    OrderStatus: 0,
    PayStatus: 0,
    PaymentMethod: 0,
    RiskLevel: 0,
    ActivityType: 0,
    AppType: 1,
    ShippingNo: '',
    Remark: '',
    CreateTime: '',
    UpdateTime: ''
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
