<template>
  <!-- @opened="handleOpened": 对话框动画完全完成后触发，用于重置滚动位置-->
  <el-dialog v-model="isShowDialog" title="订单详情" draggable width="1000px" :close-on-click-modal="true"
  class="order-detail-dialog" @closed="handleClosed" :style="{ maxHeight: '80vh' }" @opened="handleOpened">
    <!-- 添加滑动功能，视口宽度百分比设置为80-->
      <!-- 内联样式（局部控制）， 智能滚动，控制内容溢出-->
      <div v-loading="loading" ref="detailContainer" class="order-detail-container" 
      :style="{ overflowY: 'auto', maxHeight: 'calc(80vh - 120px)' }">
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
          <el-descriptions-item label="微信交易号">
            {{ orderData.transactionId || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="应用类型">
            {{ orderData.appType }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 金额信息卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><WalletFilled /></el-icon>
            <span>金额信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="订单总金额" label-class-name="desc-label" :column="2">
            <span class="amount-price">¥{{ orderData.totalAmount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="微信支付金额" label-class-name="desc-label">
            <span class="amount-price">¥{{ orderData.wxPayAmount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="优惠金额" label-class-name="desc-label">
            <span class="discount-amount">-¥{{ orderData.discountAmount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实际支付金额" label-class-name="desc-label">
            <span class="pay-amount-price">¥{{ orderData.payAmount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="余额支付金额" label-class-name="desc-label">
            <span class="amount-price">¥{{ orderData.balanceAmount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ getPaymentMethodText(orderData.paymentMethod) }}
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelType(orderData.riskLevel)" size="large">
              {{ getRiskLevelText(orderData.riskLevel) }}
            </el-tag>
            <br>
            {{orderData.riskReason || '暂无风险原因' }}
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
          <el-descriptions-item label="最新物流明细">
            <!-- 预留接入快递查询api -->
            <!-- operateTime 最新信息时间戳 -->
            {{ formatTimeDisplay(orderData.payTime) }}
            <br>
            <!-- context 信息 -->
            {{'【内容测试】快件在【泉州晋江集散中心】已装车，准备发往 【莆田黄石集散中心】' }}
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

      <!--  团购信息卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
          <el-icon><Orange /></el-icon>
            <span>团购信息</span>
          </div>
        </template>
          <el-descriptions :column="2" border>  
            <el-descriptions-item label="活动类型">
              {{ getActivityTypeText(orderData.activityType) }}
            </el-descriptions-item>
            <el-descriptions-item label="团购状态">
              <el-tag :type="getGroupBuyStatusType(orderData.groupBuyStatus)" size="large">
                {{ getGroupBuyStatusText(orderData.groupBuyStatus) }}
              </el-tag> 
            </el-descriptions-item>          
            <el-descriptions-item label="一级分销员ID">
              {{ orderData.firstLevelPersonalID || '无' }}
            </el-descriptions-item>
            <el-descriptions-item label="二级分销员ID">
              {{ orderData.secondLevelPersonalID || '无' }}
            </el-descriptions-item>
            <el-descriptions-item label="一级分佣金额">
              <span class="pay-amount-price">¥{{ orderData.firstLevelPersonalID || '0.00' }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="二级分佣金额">
              <span class="pay-amount-price">¥{{ orderData.secondLevelAmount || '0.00' }}</span>
            </el-descriptions-item>
          </el-descriptions>   
      </el-card>

      <!--  时间信息卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
          <el-icon><QuartzWatch /></el-icon>
            <span>时间信息</span>
          </div>
        </template>
          <el-descriptions :column="2" border>  
            <el-descriptions-item label="订单创建时间">
              {{ formatTimeDisplay(orderData.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="支付时间">
              {{ formatTimeDisplay(orderData.payTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="发货时间">
              {{ formatTimeDisplay(orderData.shippingTime) }}
            </el-descriptions-item> 
            <el-descriptions-item label="完成时间">
              {{ formatTimeDisplay(orderData.completeTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ formatTimeDisplay(orderData.updateTime) }}
            </el-descriptions-item>                          
          </el-descriptions>   
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
import { ref, reactive, nextTick, onMounted } from 'vue'
import { Document, WalletFilled, Location, Van, ChatDotRound, Orange, QuartzWatch } from '@element-plus/icons-vue'
import {
  getOrderStatusText,
  getOrderStatusType,
  getPayStatusText,
  getPayStatusType,
  getRiskLevelText,
  getRiskLevelType,
  getPaymentMethodText,
  getActivityTypeText,
  getGroupBuyStatusType,
  getGroupBuyStatusText           
} from '@/constants/order'

/**
 * 处理时间显示
 */
const formatTimeDisplay = (timeStr) => {
  if (!timeStr || timeStr === '0001-01-01 00:00:00') {
    return '-'
  }
  return timeStr
}

const isShowDialog = ref(false)
const loading = ref(false)
const detailContainer = ref(null)//订单详情容器DOM引用，用于在对话框重新打开时重置滚动位置

// 订单详情数据
const orderData = reactive({
  orderId: null,
  orderNo: '',
  appType: '',
  transactionId: '',
  personalID: '',
  businessId: '',
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  totalAmount: 0,
  payAmount: 0,
  balanceAmount: 0,
  discountAmount: 0,
  wxPayAmount: 0,
  orderStatus: 0,
  payStatus: 0,
  payTime: '',
  paymentMethod: 0,
  riskLevel: 0,
  activityType: 0,
  activityId: '',
  groupBuyStatus: 0,
  firstLevelPersonalID: '',
  secondLevelPersonalID: '',
  firstLevelAmount: 0,
  secondLevelAmount: 0,
  shippingNo: '',
  remark: '',
  createTime: '',
  updateTime: '',
  completeTime: '',
  shippingTime: '',
})


/**
 * 打开详情弹窗
 */
const openDialog = async (row) => {
  try {
    loading.value = true
    isShowDialog.value = true
    Object.assign(orderData, row)
  } catch (error) {
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
 * 对话框完全显示后的回调函数
 * 
 * 解决订单详情对话框滚动位置记忆问题：
 * 当用户关闭对话框再重新打开时，确保滚动条回到顶部位置
 * 
 * 采用的技术方案：
 * 1. 使用 @opened 事件 (Element Plus dialog组件动画完成后触发)
 * 2. 使用 nextTick 确保DOM渲染完成
 * 3. 使用 ref 安全访问DOM元素
 * 4. 重置 scrollTop 到0 (顶部位置)
 */
const handleOpened = async () => {
  // 等待Vue完成DOM更新，确保detailContainer.value可用
  await nextTick()
  // 安全地访问容器DOM元素并重置滚动位置
  if (detailContainer.value) {
    detailContainer.value.scrollTop = 0  // 设置滚动条到最顶部位置
  }
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

// 生命周期钩子
// 组件挂载完成后执行数据初始化
onMounted(() => {
})

// 暴露方法给父组件
defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.order-detail-dialog {
  /* 使用深度选择器穿透scoped限制 */
  :deep(.el-dialog__body) {
    padding: 20px;
    max-height: calc(80vh - 120px);
    overflow-y: auto;
  }
}

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
