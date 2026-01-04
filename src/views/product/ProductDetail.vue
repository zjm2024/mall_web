<template>
  <div class="product-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEditMode ? '编辑商品' : isAddMode ? '添加商品' : '商品详情' }}</span>
          <div class="header-actions">
            <el-button @click="goBack">返回</el-button>
            <el-button 
              v-if="!isViewMode" 
              type="primary" 
              @click="handleSubmit"
              :loading="submitting"
            >
              保存
            </el-button>
          </div>
        </div>
      </template>
      
      <el-form 
        ref="formRef" 
        :model="formData" 
        :rules="rules" 
        label-width="120px" 
        :disabled="isViewMode"
      >
        <!-- 基本信息 -->
        <el-form-item label="商品名称" prop="ProductName">
          <el-input v-model="formData.ProductName" placeholder="请输入商品名称" />
        </el-form-item>
        
        <!-- 商品分类 -->
        <el-form-item label="商品分类" prop="CategoryId">
          <el-select v-model="formData.CategoryId" placeholder="请选择商品分类">
            <el-option 
              v-for="category in categoryOptions" 
              :key="category.CategoryId" 
              :label="category.CategoryName" 
              :value="category.CategoryId" 
            />
          </el-select>
        </el-form-item>
        
        <!-- 商品主图 -->
        <el-form-item label="商品主图" prop="ProductImage">
          <el-upload
            action="/api/upload/product-image"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
          <div v-if="formData.ProductImage" class="image-preview">
            <img :src="formData.ProductImage" alt="商品主图" />
          </div>
        </el-form-item>
        
        <!-- 价格 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="原价" prop="OriginalPrice">
              <el-input-number 
                v-model="formData.OriginalPrice" 
                :min="0" 
                :precision="2" 
                style="width: 100%;" 
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前售价" prop="CurrentPrice">
              <el-input-number 
                v-model="formData.CurrentPrice" 
                :min="0" 
                :precision="2" 
                style="width: 100%;" 
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 库存 -->
        <el-form-item label="总库存" prop="TotalStock">
          <el-input-number v-model="formData.TotalStock" :min="0" />
          <span class="form-tip">设置为0表示不限制库存</span>
        </el-form-item>
        
        <!-- 限购 -->
        <el-form-item label="每人限购" prop="PerPersonLimit">
          <el-input-number v-model="formData.PerPersonLimit" :min="0" />
          <span class="form-tip">设置为0表示不限制</span>
        </el-form-item>
        
        <!-- 商品详情 -->
        <el-form-item label="商品详情" prop="ProductContent">
          <RichTextEditor 
            v-model="formData.ProductContent" 
            :disabled="isViewMode"
          />
        </el-form-item>
        
        <!-- 其他设置 -->
        <el-form-item label="是否显示价格" prop="ShowPrice">
          <el-switch v-model="formData.ShowPrice" :active-value="1" :inactive-value="0" />
        </el-form-item>
        
        <el-form-item label="商品状态" prop="ProductStatus">
          <el-radio-group v-model="formData.ProductStatus">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- 佣金设置 -->
        <el-form-item label="佣金设置" v-if="isEditMode || isAddMode">
          <el-checkbox v-model="formData.CommissionEnabled">开启返佣</el-checkbox>
          <div v-if="formData.CommissionEnabled" style="margin-top: 20px;">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="一级分佣比例" prop="FirstLevelRate">
                  <el-input-number 
                    v-model="formData.FirstLevelRate" 
                    :min="0" 
                    :max="100" 
                    :precision="2"
                    style="width: 100%;"
                  />
                  <span class="form-tip">%</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="二级分佣比例" prop="SecondLevelRate">
                  <el-input-number 
                    v-model="formData.SecondLevelRate" 
                    :min="0" 
                    :max="100" 
                    :precision="2"
                    style="width: 100%;"
                  />
                  <span class="form-tip">%</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import RichTextEditor from '@/components/RichTextEditor.vue'
import productApi from '@/api/modules/product'

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => route.name === 'ProductEdit')
const isAddMode = computed(() => route.name === 'ProductAdd')
const isViewMode = computed(() => route.name === 'ProductDetail')

const productId = computed(() => route.params.id)

// 表单相关
const formRef = ref()
const submitting = ref(false)
const formData = reactive({
  AppType: 1,
  ProductName: '',
  CategoryId: '',
  ProductImage: '',
  OriginalPrice: 0,
  CurrentPrice: 0,
  TotalStock: 0,
  PerPersonLimit: 0,
  ProductContent: '',
  ShowPrice: 1,
  ProductStatus: 1,
  CommissionEnabled: 0,
  FirstLevelRate: 0,
  SecondLevelRate: 0,
  AntiRefresh: 0,
  MaxDailyOrders: 0,
  SortOrder: 0
})

// 验证规则
const rules = {
  ProductName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  CategoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  OriginalPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
  CurrentPrice: [{ required: true, message: '请输入当前售价', trigger: 'blur' }],
}

const categoryOptions = ref([])

// 方法
const fetchProductDetail = async () => {
  if (isAddMode.value) return
  
  try {
    const res = await productApi.getProductDetail(productId.value)
    Object.assign(formData, res.data)
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
  }
}

const fetchCategoryOptions = async () => {
  try {
    const res = await productApi.getCategoryOptions()
    categoryOptions.value = res.data || []
  } catch (error) {
    console.error('获取分类选项失败:', error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (isEditMode.value) {
      await productApi.updateProduct(productId.value, formData)
      ElMessage.success('更新成功')
    } else {
      await productApi.createProduct(formData)
      ElMessage.success('添加成功')
    }
    
    goBack()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(isEditMode.value ? '更新失败' : '添加失败')
  } finally {
    submitting.value = false
  }
}

const handleImageSuccess = (response) => {
  if (response.code === 0) {
    formData.ProductImage = response.data.url
    ElMessage.success('上传成功')
  }
}

const beforeImageUpload = (file) => {
  const isImage = /^image\/(jpeg|png|gif|webp)$/.test(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}

const goBack = () => {
  router.push('/product')
}

// 生命周期
onMounted(() => {
  fetchCategoryOptions()
  fetchProductDetail()
})
</script>

<style lang="scss" scoped>
.product-detail {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-actions {
      display: flex;
      gap: 12px;
    }
  }
  
  .image-preview {
    margin-top: 12px;
    
    img {
      max-width: 200px;
      max-height: 200px;
      border-radius: 4px;
      border: 1px solid #e4e7ed;
    }
  }
  
  .form-tip {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 22px;
  }
}
</style>