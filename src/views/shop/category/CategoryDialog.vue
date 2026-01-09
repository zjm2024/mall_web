<template>
  <el-dialog v-model="isShowDialog" :title="dialogTitle" draggable width="520px" :close-on-click-modal="false"
    :show-close="false" @update:model-value="$emit('update:modelValue', $event)" @closed="handleClosed">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="right" size="large">
      <!-- 父分类显示 -->
      <el-form-item v-if="parentCategory.categoryId" label="父分类" class="form-item-large">
        <div class="parent-category">
          <el-tag type="primary" size="large">
            {{ parentCategory.categoryName }}
          </el-tag>
          <span class="parent-level">(第{{ parentCategory.level }}级)</span>
        </div>
      </el-form-item>

      <!-- 分类名称 -->
      <el-form-item label="分类名称" prop="CategoryName" class="form-item-large">
        <el-input v-model="formData.categoryName" placeholder="请输入分类名称" maxlength="100" show-word-limit size="large"
          :disabled="mode == 'edit'" clearable />
      </el-form-item>

      <!-- 分类图标 -->
      <el-form-item label="分类图标" prop="Icon" class="form-item-large">
        <div class="icon-upload">
          <el-input v-model="formData.icon" placeholder="请输入图标URL或选择上传" size="large" clearable
            style="flex: 1; margin-right: 12px;" />
          <el-upload action="/api/upload/image" :show-file-list="false" :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <el-button type="primary" size="large">上传</el-button>
          </el-upload>
        </div>
        <div v-if="formData.icon" class="icon-preview">
          <span class="preview-text">图标预览：</span>i
          <img :src="formData.icon" alt="图标" class="icon-image" />
        </div>
      </el-form-item>

      <!-- 排序 -->
      <el-form-item label="排序" prop="sortOrder" class="form-item-large">
        <div class="sort-container">
          <el-input-number v-model="formData.sortOrder" :min="0" :max="9999" controls-position="right" size="large"
            style="width: 160px;" />
          <span class="form-tip">数字越大，排序越靠前</span>
        </div>
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="状态" prop="status" class="form-item-large">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1" size="large">显示</el-radio>
          <el-radio :label="0" size="large">隐藏</el-radio>
        </el-radio-group>
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
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { createCategory, updateCategory } from '@/api/modules/category'
import { useUserStore } from '@/stores/user'

const props = defineProps({

  mode: {
    type: String,
    default: 'add'
  },

  parentCategory: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['success'])

// 表单引用
const formRef = ref()
const submitting = ref(false)

const userStore = useUserStore()

// 表单数据
const formData = reactive({
  categoryId: null,
  categoryName: '',
  icon: '',
  sortOrder: 0,
  status: 1,
  parentId: 0,
  level: 1
})

const isShowDialog = ref(false)

// 验证规则
const rules = {
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
    { type: 'number', min: 0, max: 9999, message: '排序值必须在 0-9999 之间', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 计算属性
const dialogTitle = computed(() => {
  if (props.mode === 'add') {
    return props.parentCategory.categoryId ? `添加子分类 (${props.parentCategory.categoryName})` : '添加分类'
  }
  return `编辑分类 - ${formData.categoryName}`
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
      categoryId: formData.categoryId,
      categoryName: formData.categoryName,
      status: formData.status,
      icon: formData.icon,
      level: formData.level,
      sortOrder: formData.sortOrder,
      parentId: formData.parentId,
      appType: userStore.userInfo.appType,
      businessId: userStore.userInfo.businessId,
    }
    var res
    if (props.mode === 'add') {
      res = await createCategory(submitData)
      ElMessage.success('添加成功')
    } else {
      res = await updateCategory(submitData)
      ElMessage.success('更新成功')
    }
    //传回category
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