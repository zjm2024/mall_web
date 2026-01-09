<template>
  <el-dialog v-model="isShowDialog" :title="dialogTitle" draggable width="600px" :close-on-click-modal="false"
    :show-close="false" @closed="handleClosed">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="right" size="large">

      <el-row>
        <el-col :span="12">




          <!-- 账号 -->
          <el-form-item label="账号" prop="userNo" class="form-item-large">
            <el-input v-model="formData.userNo" placeholder="请输入账号(手机号码)" maxlength="50" size="large"
              :disabled="mode == 'edit'" clearable />
          </el-form-item>

          <!-- 商户号 -->
          <el-form-item label="商户号" prop="businessId" class="form-item-large">
            <el-input v-model="formData.businessId" placeholder="请输入商户号" maxlength="50" size="large"
              :disabled="mode == 'edit'" clearable />
          </el-form-item>



          <!-- 用户昵称 -->
          <el-form-item label="用户昵称" prop="userName" class="form-item-large">
            <el-input v-model="formData.userName" placeholder="请输入用户昵称" maxlength="50" size="large"
              :disabled="mode == 'edit'" clearable />
          </el-form-item>

          <!-- 用户姓名 -->
          <el-form-item label="用户姓名" prop="realName" class="form-item-large">
            <el-input v-model="formData.realName" placeholder="请输入用户姓名" maxlength="50" size="large"
              :disabled="mode == 'edit'" clearable />
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="头像" class="form-item-large">
            <el-upload :class="{ 'hidePlus': hideUpload }" v-model:file-list="filelist" :auto-upload="false"
              list-type="picture-card" :multiple="false" :limit="1" :on-change="onChangeFile"
              :on-preview="handlePictureCardPreview" accept=".jpg,.png" :on-remove="handleRemove">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 手机号码 -->
      <el-form-item label="手机号码" prop="phone" class="form-item-large">
        <el-input v-model="formData.phone" placeholder="请输入手机号码" show-word-limit size="large" clearable />
      </el-form-item>

      <!-- 邮箱地址 -->
      <el-form-item label="邮箱地址" prop="email" class="form-item-large">
        <el-input v-model="formData.email" placeholder="请输入邮箱地址" show-word-limit size="large" clearable />
      </el-form-item>


      <el-row>
        <el-col :span="12">
          <!-- 状态 -->
          <el-form-item label="状态" prop="status" class="form-item-large">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1" size="large">正常</el-radio>
              <el-radio :label="0" size="large">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- 超管 -->
          <el-form-item label="" prop="isSuperAdmin" class="form-item-large">
            <el-checkbox v-model="formData.isSuperAdmin" label="超级管理员" :true-label="1" :false-label="0"></el-checkbox>
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
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { createUser, updateUser } from '@/api/modules/user'

const props = defineProps({

  mode: {
    type: String,
    default: 'add'
  },


})

const emits = defineEmits(['success'])

// 表单引用
const formRef = ref()
const submitting = ref(false)

// 表单数据
const formData = reactive({
  adminId: null,
  businessId: 0,
  userNo: '',
  userName: '',
  realName: '',
  avatar: '',
  isSuperAdmin: 0,
  status: 1,
  phone: '',
  email: '',
})

const filelist = ref([])

const isShowDialog = ref(false)

// 验证规则
const rules = {
  userNo: [
    { required: true, message: '请输入账号(手机号码)', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  userName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入用户姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}



// 计算属性
const dialogTitle = computed(() => {
  if (props.mode === 'add') {
    return '添加用户'
  }
  return `编辑用户 - ${formData.userName}`
})


// 打开弹窗
const openDialog = async (row) => {
  Object.assign(formData, JSON.parse(JSON.stringify(row)));
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
      adminId: formData.adminId,
      businessId: formData.businessId,
      userNo: formData.userNo,
      userName: formData.userName,
      realName: formData.realName,
      avatar: formData.avatar,
      isSuperAdmin: formData.isSuperAdmin,
      status: formData.status,
      phone: formData.phone,
      email: formData.email,
      appType: 1
    }
    var res
    if (props.mode === 'add') {
      res = await createUser(submitData)
      ElMessage.success('添加成功')
    } else {
      res = await updateUser(submitData)
      ElMessage.success('更新成功')
    }
    //传回user
    closeDialog(res.result)
  } catch (error) {


  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  isShowDialog.value = false
}

const handleClosed = () => {

}

const handleUploadSuccess = (response) => {
  if (response.code === 0) {
    localFormData.Icon = response.data.url
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const beforeUpload = (file) => {
  const isImage = /^image\/(jpeg|png|gif|webp|svg\+xml)$/.test(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }

  return true
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