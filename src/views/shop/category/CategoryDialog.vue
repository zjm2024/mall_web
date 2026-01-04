<template>
  <el-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="520px"
    :close-on-click-modal="false"
    :show-close="false"
    @update:model-value="$emit('update:modelValue', $event)"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-position="right"
      size="large"
    >
      <!-- 父分类显示 -->
      <el-form-item v-if="parentCategory.CategoryId" label="父分类" class="form-item-large">
        <div class="parent-category">
          <el-tag type="primary" size="large">
            {{ parentCategory.CategoryName }}
          </el-tag>
          <span class="parent-level">(第{{ parentCategory.Level }}级)</span>
        </div>
      </el-form-item>

      <!-- 分类名称 -->
      <el-form-item label="分类名称" prop="CategoryName" class="form-item-large">
        <el-input
          v-model="formData.CategoryName"
          placeholder="请输入分类名称"
          maxlength="100"
          show-word-limit
          size="large"
          clearable
        />
      </el-form-item>

      <!-- 分类图标 -->
      <el-form-item label="分类图标" prop="Icon" class="form-item-large">
        <div class="icon-upload">
          <el-input
            v-model="formData.Icon"
            placeholder="请输入图标URL或选择上传"
            size="large"
            clearable
            style="flex: 1; margin-right: 12px;"
          />
          <el-upload
            action="/api/upload/image"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button type="primary" size="large">上传</el-button>
          </el-upload>
        </div>
        <div v-if="formData.Icon" class="icon-preview">
          <span class="preview-text">图标预览：</span>
          <img :src="formData.Icon" alt="图标" class="icon-image" />
        </div>
      </el-form-item>

      <!-- 排序 -->
      <el-form-item label="排序" prop="SortOrder" class="form-item-large">
        <div class="sort-container">
          <el-input-number
            v-model="formData.SortOrder"
            :min="0"
            :max="9999"
            controls-position="right"
            size="large"
            style="width: 160px;"
          />
          <span class="form-tip">数字越大，排序越靠前</span>
        </div>
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="状态" prop="Status" class="form-item-large">
        <el-radio-group v-model="formData.Status">
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

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'add'
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  parentCategory: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref()
const submitting = ref(false)

// 表单数据
const localFormData = reactive({
  CategoryName: '',
  Icon: '',
  SortOrder: 0,
  Status: 1,
  ParentId: 0,
  Level: 1,
  CategoryId: null,
  ...props.formData
})

// 验证规则
const rules = {
  CategoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  SortOrder: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
    { type: 'number', min: 0, max: 9999, message: '排序值必须在 0-9999 之间', trigger: 'blur' }
  ],
  Status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 计算属性
const dialogTitle = computed(() => {
  if (props.mode === 'add') {
    return props.parentCategory.CategoryId ? `添加子分类 (${props.parentCategory.CategoryName})` : '添加分类'
  }
  return `编辑分类 - ${localFormData.CategoryName}`
})

// 监听父组件传递的formData
watch(() => props.formData, (newVal) => {
  Object.assign(localFormData, newVal)
}, { deep: true, immediate: true })

// 监听modelValue变化，当对话框打开时重置表单
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (formRef.value) {
        formRef.value.clearValidate()
      }
    })
  }
})

// 方法
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const submitData = {
      ...localFormData,
      AppType: 1
    }
    
    if (props.mode === 'add') {
      await createCategory(submitData)
      ElMessage.success('添加成功')
    } else {
      await updateCategory(localFormData.CategoryId, submitData)
      ElMessage.success('更新成功')
    }
    
    emit('success')
    handleCancel()
  } catch (error) {
    if (error.errors) {
      ElMessage.warning('请正确填写表单')
      return
    }
    console.error('提交失败:', error)
    ElMessage.error(props.mode === 'add' ? '添加失败' : '更新失败')
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  console.log('取消按钮被点击') // 调试用
  emit('update:modelValue', false)
}

const handleClosed = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 重置表单数据到初始状态
  Object.assign(localFormData, {
    CategoryName: '',
    Icon: '',
    SortOrder: 0,
    Status: 1,
    ParentId: props.parentCategory.CategoryId || 0,
    Level: props.parentCategory.CategoryId ? props.parentCategory.Level + 1 : 1,
    CategoryId: null
  })
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