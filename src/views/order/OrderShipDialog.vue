
<template>
  <el-dialog v-model="isShowDialog" :title="dialogTitle" draggable width="800px" :close-on-click-modal="false"
    :show-close="false" @closed="handleClosed">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="right" size="large">
      <el-row>
        <el-col :span="12">
          <!-- 订单处理状态 -->
          <el-form-item label="处理状态" prop="orderStatus" class="form-item-large">
            <el-select v-model="formData.orderStatus" placeholder="请选择需要的订单处理状态" size="large" style="width: 100%;"
              @change="handleOrderStatusChange">
              <!-- 快递发货，含换货发货、赠送发货、正常发货，提示要填写快递单号 -->
              <el-option label="快递发货（含实体产品换货发货、赠送发货、正常发货）" :value="OrderStatus.SHIPPED" />
              <!-- 无需发货，含线下售卖、兑换、赠送以及线上兑换码，提示操作人要尽快处理，以调整库存 -->
              <el-option label="线下售卖、兑换、赠送以及线上售卖兑换码以及其他非实体产品（无需发货）" :value="OrderStatus.COMPLETED" />
              <!-- 快递回撤，含换货、途中退货，提示操作人要尽快撤回快递 -->
              <el-option label="快递回撤（换货、途中退货）" value="dangerous" />
              <!-- 取消订单，当货品未发货、回撤到库时选此项，跳转到OrderCancelDialog对话框进行进一步的操作 -->
              <el-option label="取消订单" value="cancel_Order" />
              <!-- <el-option label="已关闭" :value="OrderStatus.CLOSED" /> -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
      <!-- 物流单号 -->
      <el-form-item label="物流单号" prop="shippingNo" class="form-item-large">
        <el-input v-model="formData.shippingNo" placeholder="请输入物流单号" maxlength="50" size="large" clearable 
          @blur="formRef?.validateField('shippingNo')" />
      </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel" size="large" style="width: 120px;">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting" size="large" style="width: 120px;">
          {{ submitting ? '处理中...' : '确定' }}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 取消订单对话框 -->
  <order-cancel-dialog ref="orderCancelDialogRef" @success="handleCancelOrderSuccess" />
</template>

<script setup>
/**
 * 订单发货以及其他处理对话框
 */
/**
 * 订单弹窗
 * @param {Object} props - 属性
 * @param {Function} emits - 事件
 * @param {Object} formRef - 表单引用
 * @param {Boolean} submitting - 是否处理中
 * @param {Object} formData - 表单数据
 * @param {Boolean} isShowDialog - 是否显示弹窗
 * @param {Object} rules - 验证规则
 * @param {Object} userStore - 用户信息
 * @param {Function} handleCancel - 取消
 * @param {Function} handleSubmit - 提交
 * @param {Function} handleClosed - 关闭
 * 
 * 功能：
 * 1. 订单发货
 * 2. 取消订单（转CancelDialog）
 * 
 */
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import orderApi from '@/api/modules/order'
import OrderCancelDialog from './OrderCancelDialog.vue' //取消对话框
import {
  OrderStatus,
  PayStatus,
  RiskLevel,
  PaymentMethod,
  ActivityType
} from '@/constants/order'

const props = defineProps({
  mode: {
    type: String,
    default: 'add'
  }
})

const emits = defineEmits(['success'])

// 表单引用
const formRef = ref()
const submitting = ref(false)
const orderCancelDialogRef = ref()

// 表单数据
const formData = reactive({
  orderId: null,
  orderNo: '',
  personalId: '',
  businessId: '',
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  totalAmount: 0,
  totalPayAmount: 0,
  orderStatus: OrderStatus.PENDING,
  payStatus: PayStatus.UNPAID,
  paymentMethod: PaymentMethod.WECHAT,
  riskLevel: RiskLevel.NORMAL,
  activityType: ActivityType.NORMAL,

  shippingNo: '',
  remark: ''
})

const isShowDialog = ref(false)

// 验证规则
const rules = {
  orderNo: [
    { required: true, message: '请输入订单号', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  orderStatus: [
    { required: true, message: '请选择订单状态', trigger: 'change' }
  ],
  shippingNo: [
    {
      validator: (rule, value, callback) => {
        // 检查是否选择了发货状态（需要物流单号的状态）
        const isShippingStatus = formData.orderStatus === OrderStatus.SHIPPED
        
        if (isShippingStatus && (!value || value.trim() === '')) {
          callback(new Error('发货状态必须填写物流单号'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 计算属性
const dialogTitle = computed(() => {
  if (props.mode === 'add') {
    return '处理订单'
  }
  return `处理订单 - ${formData.orderNo}`
})

// 打开弹窗
const openDialog = async (row) => {
  if (row && (row.OrderId || row.orderId)) {
    // 处理字段名大小写不一致的问题
    const orderData = {}
    // 优先使用大写字段名（符合模拟数据格式），回退到小写字段名
    Object.keys(row).forEach(key => {
      if (key.charAt(0) === key.charAt(0).toUpperCase()) {
        // 保留原有字段名
        orderData[key] = row[key]
      } else if (row[key.toUpperCase()] !== undefined) {
        // 尝试大写字段名
        orderData[key.toUpperCase()] = row[key.toUpperCase()]
      } else {
        orderData[key] = row[key]
      }
    })
    Object.assign(formData, orderData)
  } else {
    // 重置表单为默认值
    Object.assign(formData, {
      orderStatus: OrderStatus.PENDING,
      shippingNo: ''
    })
  }
  isShowDialog.value = true
}

// 关闭弹窗
const closeDialog = (res) => {
  emits('success', res)
  isShowDialog.value = false
}

// 方法
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    // 检查是否是取消订单选项
    if (formData.orderStatus === 'cancel_Order') {
      // 关闭当前对话框，打开取消订单对话框
      isShowDialog.value = false
      // 传递当前订单数据给取消订单对话框
      orderCancelDialogRef.value.openDialog(formData)
      return
    }

    const submitData = {
      orderStatus: formData.orderStatus,
      shippingNo: formData.shippingNo
    }

    // 如果是编辑模式，添加订单ID
    if (props.mode === 'edit') {
      submitData.orderId = formData.orderId
    }

    // 检查是否是快递回撤操作，显示特殊提示
    if (formData.orderStatus === 'dangerous') {
      ElMessage.warning('【提示语】提示操作人要尽快撤回快递（日后可改动）')
      // 将状态转换为最终的实际状态值
      formData.orderStatus = OrderStatus.PENDING // 切换到“待处理”状态，货物归库后选取消订单选项将订单关闭
    }

    let res
    if (props.mode === 'add') {
      res = await orderApi.createOrder(submitData)
      ElMessage.success('添加成功')
    } else {
      res = await orderApi.updateOrder(submitData)
      ElMessage.success('更新成功')
    }

    closeDialog(res.result)
  } catch (error) {
    console.error('提交订单失败:', error)
    if (error !== 'cancel') {
      ElMessage.error(error.message || '提交失败')
    }
  } finally {
    submitting.value = false
  }
}

// 处理取消订单成功后的回调
const handleCancelOrderSuccess = (res) => {
  // 刷新订单列表或执行其他操作
  closeDialog(res)
}

// 处理订单状态变化
const handleOrderStatusChange = () => {
  // 当状态改变时，如果选择了发货状态，立即验证物流单号
  if (formData.orderStatus === OrderStatus.SHIPPED) {
    formRef.value?.validateField('shippingNo')
  } else {
    // 如果切换到非发货状态，清除物流单号的验证错误
    formRef.value?.clearValidate('shippingNo')
  }
}

const handleCancel = () => {
  isShowDialog.value = false
}

const handleClosed = () => {
  // 可以在这里做一些清理工作
}

// 导出对象
defineExpose({ openDialog })
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: 12px;

  .el-dialog__header {
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
    margin-right: 0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .el-dialog__body {
    padding: 24px;
  }

  .el-dialog__footer {
    padding: 20px 24px;
    border-top: 1px solid #e4e7ed;
  }
}

.form-item-large {
  margin-bottom: 22px;

  :deep(.el-form-item__label) {
    font-size: 15px;
    font-weight: 500;
    color: #606266;
    height: 40px;
    line-height: 40px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select),
  :deep(.el-textarea__inner) {
    font-size: 14px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;

  .el-button {
    font-size: 15px;
    font-weight: 500;
    border-radius: 8px;

    &:first-child {
      border: 1px solid #dcdfe6;
      color: #606266;

      &:hover {
        border-color: #409eff;
        color: #409eff;
        background-color: #ecf5ff;
      }
    }
  }
}
</style>
