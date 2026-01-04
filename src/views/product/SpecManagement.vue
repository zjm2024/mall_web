<template>
  <div class="spec-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>规格管理 - {{ productInfo.ProductName }}</span>
          <div class="header-actions">
            <el-button @click="goBack">返回</el-button>
            <el-button type="primary" @click="handleAddSpec">添加规格</el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="specList" v-loading="loading">
        <el-table-column prop="SpecName" label="规格名称" />
        <el-table-column prop="SpecValue" label="规格值" />
        <el-table-column prop="Price" label="价格" width="120">
          <template #default="{ row }">
            ¥{{ row.Price }}
          </template>
        </el-table-column>
        <el-table-column prop="Stock" label="库存" width="120" />
        <el-table-column label="是否默认" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.IsDefault === 1" type="success">默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEditSpec(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDeleteSpec(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 规格编辑对话框 -->
    <el-dialog v-model="specDialogVisible" :title="specDialogTitle" width="500px">
      <el-form ref="specFormRef" :model="specForm" :rules="specRules" label-width="100px">
        <el-form-item label="规格名称" prop="SpecName">
          <el-input v-model="specForm.SpecName" placeholder="如：颜色、尺寸" />
        </el-form-item>
        <el-form-item label="规格值" prop="SpecValue">
          <el-input v-model="specForm.SpecValue" placeholder="如：红色、XL" />
        </el-form-item>
        <el-form-item label="价格" prop="Price">
          <el-input-number v-model="specForm.Price" :min="0" :precision="2" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="库存" prop="Stock">
          <el-input-number v-model="specForm.Stock" :min="0" />
        </el-form-item>
        <el-form-item label="是否默认">
          <el-switch v-model="specForm.IsDefault" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="specDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSpec">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import productApi from '@/api/modules/product'

const route = useRoute()
const router = useRouter()
const productId = route.params.productId

const loading = ref(false)
const specList = ref([])
const productInfo = ref({})
const specDialogVisible = ref(false)
const specFormRef = ref()
const specForm = reactive({
  SpecName: '',
  SpecValue: '',
  Price: 0,
  Stock: 0,
  IsDefault: 0,
  AppType: 1
})
const editingSpecId = ref(null)

const specDialogTitle = computed(() => {
  return editingSpecId.value ? '编辑规格' : '添加规格'
})

const specRules = {
  SpecName: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
  SpecValue: [{ required: true, message: '请输入规格值', trigger: 'blur' }],
  Price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

// 方法
const fetchProductInfo = async () => {
  try {
    const res = await productApi.getProductDetail(productId)
    productInfo.value = res.data || {}
  } catch (error) {
    console.error('获取商品信息失败:', error)
  }
}

const fetchSpecList = async () => {
  try {
    loading.value = true
    const res = await productApi.getSpecList(productId)
    specList.value = res.data || []
  } catch (error) {
    console.error('获取规格列表失败:', error)
    ElMessage.error('获取规格列表失败')
  } finally {
    loading.value = false
  }
}

const handleAddSpec = () => {
  editingSpecId.value = null
  resetSpecForm()
  specDialogVisible.value = true
}

const handleEditSpec = (row) => {
  editingSpecId.value = row.SpecId
  Object.assign(specForm, row)
  specDialogVisible.value = true
}

const handleDeleteSpec = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个规格吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await productApi.deleteSpec(row.SpecId)
    ElMessage.success('删除成功')
    fetchSpecList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除规格失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleSaveSpec = async () => {
  if (!specFormRef.value) return
  
  try {
    await specFormRef.value.validate()
    
    const specData = {
      ...specForm,
      ProductId: productId
    }
    
    if (editingSpecId.value) {
      // 编辑
      await productApi.updateSpec(editingSpecId.value, specData)
      ElMessage.success('更新成功')
    } else {
      // 添加
      await productApi.saveSpecs(productId, [specData])
      ElMessage.success('添加成功')
    }
    
    specDialogVisible.value = false
    fetchSpecList()
  } catch (error) {
    console.error('保存规格失败:', error)
    ElMessage.error(editingSpecId.value ? '更新失败' : '添加失败')
  }
}

const resetSpecForm = () => {
  Object.assign(specForm, {
    SpecName: '',
    SpecValue: '',
    Price: 0,
    Stock: 0,
    IsDefault: 0,
    AppType: 1
  })
}

const goBack = () => {
  router.push('/product')
}

// 生命周期
onMounted(() => {
  fetchProductInfo()
  fetchSpecList()
})
</script>

<style lang="scss" scoped>
.spec-management {
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
}
</style>