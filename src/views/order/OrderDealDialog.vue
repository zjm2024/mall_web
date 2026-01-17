<template>
  <el-dialog v-model="isShowDialog" :title="dialogTitle" draggable width="800px" :close-on-click-modal="false"
    :show-close="false" @closed="handleClosed">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="right" size="large">

      <el-row>
        <el-col :span="12">
          <!-- 收货人姓名 -->
          <el-form-item label="收货人姓名" prop="receiverName" class="form-item-large">
            <el-input v-model="formData.receiverName" placeholder="请输入收货人姓名" maxlength="50" size="large" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- 收货人电话 -->
          <el-form-item label="收货人电话" prop="receiverPhone" class="form-item-large">
            <el-input v-model="formData.receiverPhone" placeholder="请输入收货人电话" maxlength="20" size="large" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <!-- 订单总金额 -->
          <el-form-item label="订单总金额" prop="totalAmount" class="form-item-large">
            <el-input-number v-model="formData.totalAmount" :min="0" :precision="2" controls-position="right"
              size="large" style="width: 100%;" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- 实际支付金额 -->
          <el-form-item label="实际支付金额" prop="totalPayAmount" class="form-item-large">
            <el-input-number v-model="formData.totalPayAmount" :min="0" :precision="2" controls-position="right"
              size="large" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <!-- 订单状态 -->
          <el-form-item label="订单状态" prop="orderStatus" class="form-item-large">
            <el-select v-model="formData.orderStatus" placeholder="请选择订单状态" size="large" style="width: 100%;">
              <el-option label="待处理" :value="OrderStatus.PENDING" />
              <el-option label="已发货" :value="OrderStatus.SHIPPED" />
              <el-option label="已完成" :value="OrderStatus.COMPLETED" />
              <el-option label="已关闭" :value="OrderStatus.CLOSED" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- 支付状态 -->
          <el-form-item label="支付状态" prop="payStatus" class="form-item-large">
            <el-select v-model="formData.payStatus" placeholder="请选择支付状态" size="large" style="width: 100%;">
              <el-option label="待支付" :value="PayStatus.UNPAID" />
              <el-option label="已支付" :value="PayStatus.PAID" />
              <el-option label="已取消" :value="PayStatus.CANCELLED" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <!-- 支付方式 -->
          <el-form-item label="支付方式" prop="paymentMethod" class="form-item-large">
            <el-select v-model="formData.paymentMethod" placeholder="请选择支付方式" size="large" style="width: 100%;">
              <el-option label="微信" :value="PaymentMethod.WECHAT" />
              <el-option label="余额" :value="PaymentMethod.BALANCE" />
              <el-option label="混合" :value="PaymentMethod.MIXED" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- 风险等级 -->
          <el-form-item label="风险等级" prop="riskLevel" class="form-item-large">
            <el-select v-model="formData.riskLevel" placeholder="请选择风险等级" size="large" style="width: 100%;">
              <el-option label="正常" :value="RiskLevel.NORMAL" />
              <el-option label="可疑" :value="RiskLevel.SUSPICIOUS" />
              <el-option label="高风险" :value="RiskLevel.HIGH" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <!-- 活动类型 -->
          <el-form-item label="活动类型" prop="activityType" class="form-item-large">
            <el-select v-model="formData.activityType" placeholder="请选择活动类型" size="large" style="width: 100%;">
              <el-option label="普通订单" :value="ActivityType.NORMAL" />
              <el-option label="秒杀活动" :value="ActivityType.SECKILL" />
              <el-option label="团购活动" :value="ActivityType.GROUP" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>



      <!-- 收货地址 -->
      <el-form-item label="收货地址" prop="receiverAddress" class="form-item-large">
        <el-input v-model="formData.receiverAddress" type="textarea" :rows="2" placeholder="请输入收货地址"
          maxlength="200" show-word-limit size="large" />
      </el-form-item>

      <!-- 备注 -->
      <el-form-item label="备注" prop="remark" class="form-item-large">
        <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注信息" maxlength="500"
          show-word-limit size="large" />
      </el-form-item>
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
</template>

<script setup>
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
 * 1. 添加订单
 * 2. 更新订单
 * 3. 删除订单
 * 
 */
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import orderApi from '@/api/modules/order'
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

// 表单数据
const formData = reactive({
  orderId: null,
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
  appType: 1,
  remark: ''
})

const isShowDialog = ref(false)

// 验证规则
const rules = {
  receiverName: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  receiverPhone: [
    { required: true, message: '请输入收货人电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  totalAmount: [
    { required: true, message: '请输入订单总金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '订单总金额不能小于0', trigger: 'blur' }
  ],
  totalPayAmount: [
    { type: 'number', min: 0, message: '实际支付金额不能小于0', trigger: 'blur' }
  ],
  orderStatus: [
    { required: true, message: '请选择订单状态', trigger: 'change' }
  ],
  payStatus: [
    { required: true, message: '请选择支付状态', trigger: 'change' }
  ],
  paymentMethod: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ],
  riskLevel: [
    { required: true, message: '请选择风险等级', trigger: 'change' }
  ],
  activityType: [
    { required: true, message: '请选择活动类型', trigger: 'change' }
  ],
}

// 计算属性
const dialogTitle = computed(() => {
  if (props.mode === 'add') {
    return '添加订单'
  }
  return '编辑订单'
})

// 打开弹窗
const openDialog = async (row) => {
    if (row && row.orderId) {
        Object.assign(formData, row)
        
        // 保存原订单备注，但不显示在输入框中
        const originalRemark = row.remark || ''
        formData.originalRemark = originalRemark
        
        // 清空用户输入的备注，避免显示原订单备注
        formData.remark = ''
    } else {
    // 重置表单为默认值
    Object.assign(formData, {
      orderId: null,
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
      appType: 1,
      remark: ''
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

    const submitData = {
      receiverName: formData.receiverName,
      receiverPhone: formData.receiverPhone,
      receiverAddress: formData.receiverAddress,
      totalAmount: formData.totalAmount,
      totalPayAmount: formData.totalPayAmount,
      orderStatus: formData.orderStatus,
      payStatus: formData.payStatus,
      paymentMethod: formData.paymentMethod,
      riskLevel: formData.riskLevel,
      activityType: formData.activityType,
      remark: formData.remark
    }

    // 如果是编辑模式，添加订单ID
    if (props.mode === 'edit') {
      submitData.orderId = formData.orderId
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
