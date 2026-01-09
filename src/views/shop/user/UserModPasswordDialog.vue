<template>
  <el-dialog v-model="isShowDialog" :title="dialogTitle" draggable width="600px" :close-on-click-modal="false"
    :show-close="false" @closed="handleClosed">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="right" size="large">



      <!-- 账号 -->
      <el-form-item label="账号" prop="userNo" class="form-item-large">
        <el-input v-model="formData.userNo" placeholder="请输入账号(手机号码)" maxlength="50" size="large" :disabled="true"
          clearable />
      </el-form-item>

      <template v-if="props.mode === 'change'">
        <!-- 原密码 -->
        <el-form-item label="原密码" prop="oldPassword" class="form-item-large">
          <el-input v-model="formData.oldPassword" placeholder="请输入原密码" maxlength="50" size="large" clearable />
        </el-form-item>

        <!-- 新密码 -->
        <el-form-item label="新密码" prop="newPassword" class="form-item-large">
          <el-input v-model="formData.newPassword" placeholder="请输入新密码" maxlength="50" size="large" clearable />
        </el-form-item>



      </template>



    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel" size="large" style="width: 120px;">取消</el-button>


        <template v-if="props.mode === 'change'">

          <el-button type="primary" @click="handleSubmit" :loading="submitting" size="large" style="width: 120px;">
            {{ submitting ? '处理中...' : '确定' }}
          </el-button>


        </template>


        <template v-if="props.mode === 'reset'">

          <el-button type="primary" @click="handleResetSubmit" :loading="submitting" size="large" style="width: 120px;">
            {{ submitting ? '处理中...' : '重置密码' }}
          </el-button>


        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { resetUserPassword, changeUserPassword } from '@/api/modules/user'

const props = defineProps({

  mode: {
    type: String,
    default: 'add'
  },


})


// 表单引用
const formRef = ref()
const submitting = ref(false)

// 表单数据
const formData = reactive({
  adminId: null,
  userNo: '',
  oldPassword: '',
  newPassword: '',

})


const isShowDialog = ref(false)

// 验证规则
const rules = {
  userNo: [
    { required: true, message: '请输入账号(手机号码)', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],

}



// 计算属性
const dialogTitle = computed(() => {
  if (props.mode === 'reset') {
    return `重置密码 - ${formData.userNo}`
  }
  return `修改密码 - ${formData.userNo}`
})


// 打开弹窗
const openDialog = async (row) => {
  Object.assign(formData, JSON.parse(JSON.stringify(row)));
  isShowDialog.value = true

}

// 关闭弹窗
const closeDialog = (res) => {
  isShowDialog.value = false
}

// 修改用户密码方法
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    const submitData = {
      userNo: formData.userNo,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      appType: 1
    }
    var res = await changeUserPassword(submitData)
    ElMessage.success('修改密码成功')

    //传回
    closeDialog(res.result)
  } catch (error) {
    //ElMessage.error('修改密码失败' + error)
  } finally {
    submitting.value = false
  }
}


//重置密码
const handleResetSubmit = async () => {
  try {

    submitting.value = true

    const submitData = {
      userNo: formData.userNo,
      appType: 1
    }
    var res = await resetUserPassword(submitData)
    ElMessage.success('重置成功!')
    //传回
    closeDialog(res.result)
  } catch (error) {
    //ElMessage.error('重置失败!' + error)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  isShowDialog.value = false
}

const handleClosed = () => {

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
  :deep(.el-radio__label) {
    font-size: 14px;
  }
}

.parent-category {
  display: flex;
  align-items: center;
  gap: 12px;

  .el-tag {
    font-size: 14px;
    padding: 6px 12px;
    height: auto;
  }

  .parent-level {
    color: #909399;
    font-size: 14px;
    font-weight: 400;
  }
}

.icon-upload {
  display: flex;
  align-items: center;
  width: 100%;
}

.icon-preview {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 6px;

  .preview-text {
    color: #606266;
    font-size: 14px;
    font-weight: 500;
  }

  .icon-image {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    object-fit: cover;
  }
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-tip {
  color: #909399;
  font-size: 13px;
  font-weight: 400;
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