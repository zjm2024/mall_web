<template>
  <div class="product-management">
    <!-- 整体容器 -->
    <div class="product-container">
      <!-- 头部：操作按钮和搜索区域 -->
      <div class="header-section">
        <div class="left-operations">
          <el-button type="primary" @click="handleAddProduct" size="large">
            <el-icon><Plus /></el-icon>添加商品
          </el-button>
          <el-button @click="refreshList" size="large">
            <el-icon><Refresh /></el-icon>刷新
          </el-button>
          <el-button 
            type="danger" 
            @click="handleBatchDelete" 
            :disabled="selectedRows.length === 0"
            size="large"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </div>
        
        <div class="right-search">
          <el-input
            v-model="filterForm.productName"
            placeholder="商品名称"
            clearable
            size="large"
            style="width: 180px; margin-right: 12px;"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select 
            v-model="filterForm.categoryId" 
            placeholder="商品分类" 
            clearable
            size="large"
            style="width: 150px; margin-right: 12px;"
          >
            <el-option label="全部分类" value="" />
            <el-option 
              v-for="category in categoryOptions" 
              :key="category.CategoryId" 
              :label="category.CategoryName" 
              :value="category.CategoryId" 
            />
          </el-select>
          
          <el-select 
            v-model="filterForm.productStatus" 
            placeholder="商品状态" 
            clearable
            size="large"
            style="width: 120px; margin-right: 12px;"
          >
            <el-option label="全部状态" value="" />
            <el-option label="已上架" :value="1" />
            <el-option label="已下架" :value="0" />
          </el-select>
          
          <el-button type="primary" @click="handleSearch" size="large">
            查询
          </el-button>
          <el-button @click="handleReset" size="large">
            重置
          </el-button>
        </div>
      </div>
      
      <!-- 商品表格区域 -->
      <div class="table-section">
        <el-table
          :data="productList"
          v-loading="loading"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ 
            background: '#f5f7fa', 
            color: '#303133', 
            fontWeight: 'bold',
            height: '56px'
          }"
        >
          <el-table-column type="selection" width="55" align="center" />
          
          <!-- 商品图片 -->
          <el-table-column label="商品图片" width="120" align="center">
            <template #default="{ row }">
              <el-image
                :src="row.ProductImage || '/default-product.png'"
                :preview-src-list="[row.ProductImage]"
                fit="cover"
                class="product-image"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>
          
          <!-- 商品名称 -->
          <el-table-column prop="ProductName" label="商品名称" min-width="200">
            <template #default="{ row }">
              <div class="product-info">
                <div class="product-name">{{ row.ProductName }}</div>
                <div class="product-category">
                  <el-tag size="small" type="info">
                    {{ getCategoryName(row.CategoryId) }}
                  </el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <!-- 价格 -->
          <el-table-column label="价格" width="150" align="center">
            <template #default="{ row }">
              <div class="product-price">
                <div class="current-price">
                  ¥{{ row.CurrentPrice }}
                </div>
                <div class="original-price" v-if="row.OriginalPrice > row.CurrentPrice">
                  ¥{{ row.OriginalPrice }}
                </div>
              </div>
            </template>
          </el-table-column>
          
          <!-- 库存和销量 -->
          <el-table-column label="库存/销量" width="120" align="center">
            <template #default="{ row }">
              <div>
                <div>库存: {{ row.TotalStock === 0 ? '不限' : row.TotalStock }}</div>
                <div>销量: {{ row.Sales || 0 }}</div>
              </div>
            </template>
          </el-table-column>
          
          <!-- 状态 -->
          <el-table-column prop="ProductStatus" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.ProductStatus === 1 ? 'success' : 'info'" size="large">
                {{ row.ProductStatus === 1 ? '已上架' : '已下架' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <!-- 创建时间 -->
          <el-table-column prop="CreateTime" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.CreateTime) }}
            </template>
          </el-table-column>
          
          <!-- 操作列 -->
          <el-table-column label="操作" width="280" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button
                  type="primary"
                  link
                  size="large"
                  @click="handleEditProduct(row)"
                >
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                
                <el-button
                  type="primary"
                  link
                  size="large"
                  @click="handleViewDetail(row)"
                >
                  <el-icon><View /></el-icon>详情
                </el-button>
                
                <el-button
                  type="primary"
                  link
                  size="large"
                  @click="handleManageSpec(row)"
                >
                  <el-icon><SetUp /></el-icon>规格
                </el-button>
                
                <el-popconfirm
                  title="确定要删除这个商品吗？"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  @confirm="handleDeleteProduct(row)"
                >
                  <template #reference>
                    <el-button type="danger" link size="large">
                      <el-icon><Delete /></el-icon>删除
                    </el-button>
                  </template>
                </el-popconfirm>
                
                <el-switch
                  v-model="row.ProductStatus"
                  :active-value="1"
                  :inactive-value="0"
                  inline-prompt
                  active-text="上架"
                  inactive-text="下架"
                  @change="handleStatusChange(row)"
                  style="margin-left: 12px;"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        
        <!-- 空状态 -->
        <el-empty
          v-if="!loading && productList.length === 0"
          description="暂无商品数据"
          :image-size="160"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Refresh, Search, Edit, Delete, 
  View, SetUp, Picture 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/common'
import productApi from '@/api/modules/product'

const router = useRouter()

// 数据
const loading = ref(false)
const productList = ref([])
const categoryOptions = ref([])
const selectedRows = ref([])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 筛选表单
const filterForm = reactive({
  productName: '',
  categoryId: '',
  productStatus: ''
})

// 方法
const fetchProductList = async () => {
  try {
    loading.value = true
    
    const params = {
      page: pagination.currentPage,
      limit: pagination.pageSize,
      ...filterForm
    }
    
    const res = await productApi.getProductList(params)
    productList.value = res.data.list || []
    pagination.total = res.data.total || 0
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
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

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categoryOptions.value.find(c => c.CategoryId === categoryId)
  return category ? category.CategoryName : '未知分类'
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchProductList()
}

// 重置
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  pagination.currentPage = 1
  fetchProductList()
}

// 添加商品
const handleAddProduct = () => {
  router.push('/product/add')
}

// 编辑商品
const handleEditProduct = (row) => {
  router.push(`/product/edit/${row.ProductId}`)
}

// 查看详情
const handleViewDetail = (row) => {
  router.push(`/product/detail/${row.ProductId}`)
}

// 管理规格
const handleManageSpec = (row) => {
  router.push(`/product/spec/${row.ProductId}`)
}

// 删除商品
const handleDeleteProduct = async (row) => {
  try {
    await productApi.deleteProduct(row.ProductId)
    ElMessage.success('删除成功')
    fetchProductList()
  } catch (error) {
    console.error('删除商品失败:', error)
    ElMessage.error('删除失败')
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个商品吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const productIds = selectedRows.value.map(item => item.ProductId)
    await productApi.batchDeleteProducts({ productIds })
    
    ElMessage.success('批量删除成功')
    selectedRows.value = []
    fetchProductList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 修改状态
const handleStatusChange = async (row) => {
  try {
    await productApi.updateProduct(row.ProductId, {
      ProductStatus: row.ProductStatus
    })
    ElMessage.success(row.ProductStatus === 1 ? '商品已上架' : '商品已下架')
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新失败')
    // 回滚状态
    row.ProductStatus = row.ProductStatus === 1 ? 0 : 1
  }
}

// 表格选择
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 分页
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchProductList()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchProductList()
}

// 刷新列表
const refreshList = () => {
  fetchProductList()
}

// 生命周期
onMounted(() => {
  fetchCategoryOptions()
  fetchProductList()
})
</script>

<style lang="scss" scoped>
.product-management {
  padding: 20px;
  
  .product-container {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e4e7ed;
    background: #fafafa;
    
    .left-operations {
      display: flex;
      gap: 12px;
    }
    
    .right-search {
      display: flex;
      align-items: center;
    }
  }
  
  .table-section {
    padding: 0;
    
    .product-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      border: 1px solid #e4e7ed;
      
      .image-error {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        color: #909399;
      }
    }
    
    .product-info {
      .product-name {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 6px;
      }
      
      .product-category {
        .el-tag {
          font-size: 12px;
        }
      }
    }
    
    .product-price {
      .current-price {
        font-size: 16px;
        font-weight: 600;
        color: #f56c6c;
      }
      
      .original-price {
        font-size: 12px;
        color: #909399;
        text-decoration: line-through;
        margin-top: 4px;
      }
    }
    
    .action-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .pagination-section {
      padding: 20px;
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid #e4e7ed;
    }
    
    :deep(.el-table) {
      .el-table__header-wrapper {
        border-bottom: 1px solid #e4e7ed;
      }
      
      .el-table__body-wrapper {
        tr {
          td {
            border-bottom: 1px solid #f0f2f5;
          }
          
          &:hover {
            td {
              background-color: #f5f7fa;
            }
          }
        }
      }
    }
    
    :deep(.el-empty) {
      padding: 60px 0;
      
      .el-empty__image {
        width: 160px;
        height: 160px;
      }
      
      .el-empty__description {
        margin-top: 16px;
        font-size: 16px;
        color: #909399;
      }
    }
  }
}
</style>