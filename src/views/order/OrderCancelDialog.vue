<template>
  <el-dialog v-model="isShowDialog" :title="dialogTitle" draggable width="800px" :close-on-click-modal="false"
    :show-close="false" @closed="handleClosed">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="right" size="large">

      <el-row>
        <el-col :span="12">
          <!-- 取消原因 -->
          <el-form-item label="取消原因" prop="cancelReason" class="form-item-large">
            <el-select v-model="formData.cancelReason" placeholder="请选择取消原因" size="large" style="width: 100%;" @change="handleOrderStatusChange">
            <el-option v-for="reason in cancelReasons" :key="reason.value" :label="reason.label" :value="reason.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

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
 * 订单取消对话框（从ShipDialog进入）
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
 * 1. 取消订单
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


const props = defineProps({})

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
    cancelReason: '', // 取消原因
    remark: '', // 用户输入的备注
    originalRemark: '' // 原订单备注
})

// 取消原因选项配置
const cancelReasons = [
    // 正常
    { label: '退货已归库或从未发货', value: '退货已归库或从未发货', riskLevel: RiskLevel.NORMAL },
    { label: '货品损坏，无法退回，我方确认该事实无误', value: '货品损坏，无法退回，我方确认该事实无误', riskLevel: RiskLevel.NORMAL },
    { label: '快递丢失，无法找回，我方确认该事实无误', value: '快递丢失，无法找回，我方确认该事实无误', riskLevel: RiskLevel.NORMAL },
    // 可疑
    { label: '可疑：疑似刷单', value: '可疑：疑似刷单', riskLevel: RiskLevel.MEDIUM },
    // 高风险
    { label: '危险情况1：故意刷单用户', value: '危险情况1：故意刷单用户', riskLevel: RiskLevel.HIGH },
    { label: '危险情况2：故意白嫖用户', value: '危险情况2：故意白嫖用户', riskLevel: RiskLevel.HIGH },
    { label: '危险情况3：其他，见备注', value: '危险情况3：其他，见备注', riskLevel: RiskLevel.HIGH }
]

const isShowDialog = ref(false)

// 验证规则
const rules = {
    cancelReason: [
        { required: true, message: '请选择取消原因', trigger: 'change' }
    ]
}

// 计算属性
const dialogTitle = computed(() => {return '取消订单'})

// 打开弹窗
const openDialog = async (row) => {
    Object.assign(formData, row)
        
    // 保存原订单备注，但不显示在输入框中
    const originalRemark = row.remark || ''
    formData.originalRemark = originalRemark
        
    // 清空用户输入的备注，避免显示原订单备注
    formData.remark = ''
    
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

        // 获取当前选中的取消原因
        const selectedReason = cancelReasons.find(reason => reason.value === formData.cancelReason)
        let finalRemarkParts = []

        // 第一部分：取消原因标签
        if (selectedReason) {
        finalRemarkParts.push(selectedReason.label)
        }

        // 第二部分：用户在备注框中输入的内容（排除重复内容）
        if (formData.remark.trim() && 
            (!selectedReason || formData.remark.trim() !== selectedReason.label)) {
        finalRemarkParts.push(formData.remark.trim())
        }

        // 第三部分：原订单备注
        const originalRemark = formData.originalRemark || ''
        if (originalRemark.trim()) {
        finalRemarkParts.push(`原订单备注：${originalRemark.trim()}`)
        }

        // 用"---"连接所有部分
        const finalRemark = finalRemarkParts.join('---')
        
        // 确保订单状态是CLOSED
        const finalOrderStatus = OrderStatus.CLOSED

        const submitData = {
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        receiverAddress: formData.receiverAddress,
        totalAmount: formData.totalAmount,
        totalPayAmount: formData.totalPayAmount,
        orderStatus: finalOrderStatus,
        payStatus: formData.payStatus,
        paymentMethod: formData.paymentMethod,
        riskLevel: formData.riskLevel,
        activityType: formData.activityType,
        remark: finalRemark,
        cancelReason: formData.cancelReason // 添加取消原因字段
        }

        const res = await orderApi.updateOrder(submitData)
        ElMessage.success('订单处理成功')

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

// 处理取消原因改变
const handleOrderStatusChange = (value) => {
    // 当选择取消原因时，自动更新备注和风险级别
    const selectedReason = cancelReasons.find(reason => reason.value === value)
    if (selectedReason) {
        // 更新风险级别
        formData.riskLevel = selectedReason.riskLevel
        
        // 更新备注：如果没有自定义备注，则自动填充选择的选项标签
        if (!formData.remark.trim()) {
        formData.remark = selectedReason.label
        }
    }
}

// 获取当前选中的取消原因标签
const getSelectedOrderStatusLabel = () => {
    return formData.cancelReason
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
