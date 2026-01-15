<template>
  <div class="product-management">
    <!-- 整体容器 -->
    <div class="product-container">
      <!-- 头部：操作按钮和搜索区域 -->
      <div class="header-section">
        <div class="left-operations">
          <el-button type="primary" @click="handleAddProduct" size="default">
            <el-icon>
              <Plus />
            </el-icon>添加商品
          </el-button>
          <el-button @click="refreshList" size="default">
            <el-icon>
              <Refresh />
            </el-icon>刷新
          </el-button>
          <el-button type="danger" @click="handleDeleteBatch" :disabled="selectedRows.length === 0" size="default">
            <el-icon>
              <Delete />
            </el-icon>批量删除({{ selectedRows.length }})
          </el-button>
        </div>

        <div class="right-search">
          <el-input v-model="filterForm.productName" placeholder="商品名称" clearable size="default"
            style="width: 180px; margin-right: 10px;" @keyup.enter="handleSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>


          <el-cascader v-model="filterForm.categoryId" :options="categoryOptions" :props="props" placeholder="商品分类"
            clearable size="default" style="width: 300px; margin-right: 10px;" />


          <el-select v-model="filterForm.productStatus" placeholder="商品状态" clearable size="default"
            style="width: 130px; margin-right: 10px;">
            <el-option label="全部状态" value="" />
            <el-option label="已上架" :value="1" />
            <el-option label="已下架" :value="0" />
          </el-select>

          <el-button type="primary" @click="handleSearch" size="default">
            查询
          </el-button>
          <el-button @click="handleReset" size="default">
            重置
          </el-button>
        </div>
      </div>

      <!-- 商品表格区域 -->
      <div class="table-section">
        <el-table :data="productList" v-loading="loading" style="width: 100%;" @selection-change="handleSelectionChange"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#303133',
            fontWeight: 'bold',
            height: '48px'
          }" stripe>
          <el-table-column type="selection" width="48" align="center" fixed />

          <!-- 商品图片 -->
          <el-table-column label="商品图片" width="100" align="center">
            <template #default="{ row }">
              <div class="product-image-container">
                <el-image :src="row.productImage || '/default-product.png'" :preview-src-list="[row.productImage]"
                  fit="cover" class="product-image" :hide-on-click-modal="true">
                  <template #error>
                    <div class="image-error">
                      <el-icon>
                        <Picture />
                      </el-icon>
                      <span class="error-text">加载失败</span>
                    </div>
                  </template>
                  <template #placeholder>
                    <div class="image-loading">
                      <el-icon>
                        <Loading />
                      </el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
            </template>
          </el-table-column>

          <!-- 商品名称 -->
          <el-table-column prop="productName" label="商品名称" min-width="200">
            <template #default="{ row }">
              <div class="product-info">
                <div class="product-name">{{ row.productName }}</div>
                <div class="product-category">
                  <el-tag size="small" type="info" effect="light">
                    {{ getCategoryName(row.categoryId) }}
                  </el-tag>
                  <el-tag v-if="row.CommissionEnabled" size="small" type="success" effect="light"
                    style="margin-left: 4px;">
                    返佣{{ row.firstLevelRate }}%
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
                  ¥{{ row.currentPrice }}
                </div>
                <div class="original-price" v-if="row.originalPrice > row.currentPrice">
                  <del>¥{{ row.originalPrice }}</del>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 库存和销量 -->
          <el-table-column label="库存/销量" width="130" align="center">
            <template #default="{ row }">
              <div class="stock-sales">
                <div class="stock">
                  <el-icon size="14">
                    <Box />
                  </el-icon>
                  <span>{{ row.totalStock === 0 ? '不限' : row.totalStock }}</span>
                </div>
                <div class="sales">
                  <el-icon size="14">
                    <ShoppingCart />
                  </el-icon>
                  <span>{{ row.sales || 0 }}</span>t
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 状态 -->
          <el-table-column prop="productStatus" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.productStatus" :active-value="1" :inactive-value="0" inline-prompt
                active-text="上架" inactive-text="下架" active-color="#13ce66" inactive-color="#dcdfe6"
                @change="handleStatusChange(row)" size="small" />
            </template>
          </el-table-column>

          <!-- 创建时间 -->c
          <el-table-column prop="createTime" label="创建时间" width="160">
            <template #default="{ row }">
              <div class="create-time">
                {{ formatDate(row.createTime) }}
              </div>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="220" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" @click="handleEditProduct(row)" :icon="Edit" circle
                  class="action-btn" title="编辑" />

                <el-button type="success" size="small" @click="handleViewDetail(row)" :icon="View" circle
                  class="action-btn" title="详情" />

                <el-button type="warning" size="small" @click="handleManageSpec(row)" :icon="SetUp" circle
                  class="action-btn" title="规格" />

                <el-button type="danger" size="small" @click="handleDeleteProduct(row)" :icon="Delete" circle
                  class="action-btn" title="删除" />
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-section" v-if="pagination.total > 0">
          <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" background />
        </div>

        <!-- 空状态 -->
        <el-empty v-if="!loading && productList.length === 0" description="暂无商品数据" :image-size="120" />
      </div>
    </div>

    <!-- 商品详情对话框 -->
    <el-dialog v-model="detailDialogVisible" :title="`商品详情 - ${selectedProduct?.ProductName || ''}`" width="800px"
      :close-on-click-modal="false">
      <div v-if="selectedProduct" class="product-detail-content">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">商品名称：</span>
              <span class="info-value">{{ selectedProduct.ProductName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">商品分类：</span>
              <span class="info-value">{{ getCategoryName(selectedProduct.CategoryId) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">原价：</span>
              <span class="info-value">¥{{ selectedProduct.OriginalPrice }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前售价：</span>
              <span class="info-value">¥{{ selectedProduct.CurrentPrice }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">库存：</span>
              <span class="info-value">{{ selectedProduct.TotalStock === 0 ? '不限' : selectedProduct.TotalStock }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">销量：</span>
              <span class="info-value">{{ selectedProduct.Sales || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- 商品主图 -->
        <div class="detail-section" v-if="selectedProduct.ProductImage">
          <h3 class="section-title">商品主图</h3>
          <div class="image-section">
            <el-image :src="selectedProduct.ProductImage" :preview-src-list="[selectedProduct.ProductImage]"
              fit="contain" style="width: 200px; height: 200px; border-radius: 8px;" />
          </div>
        </div>

        <!-- 商品详情（富文本内容） -->
        <div class="detail-section" v-if="selectedProduct.ProductContent">
          <h3 class="section-title">商品详情</h3>
          <div class="rich-content-wrapper">
            <div class="rich-content" v-html="selectedProduct.ProductContent"></div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false" size="default">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus, Refresh, Search, Edit, Delete,
  View, SetUp, Picture, Loading, Box, ShoppingCart
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/common'
import { useUserStore } from '@/stores/user'

import {
  getProductPageList,
  getCategoryOptions,
  deleteProduct,
  deleteBatchProducts
} from '@/api/modules/product'

const router = useRouter()
const loading = ref(false)
const productList = ref([])
const categoryOptions = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const selectedProduct = ref(null)
const userStore = useUserStore()

const props = {
  multiple: true,
  checkStrictly: true,
  label: 'categoryName',
  value: 'categoryId',
  children: 'children'
}



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

// 添加商品 - 跳转到编辑页面
const handleAddProduct = () => {
  router.push('/product/edit')
}

// 编辑商品 - 跳转到编辑页面
const handleEditProduct = (row) => {

  router.push(`/product/edit?id=${row.productId}`)
}

// 查看详情
const handleViewDetail = (row) => {
  selectedProduct.value = row
  detailDialogVisible.value = true
}

// 管理规格
const handleManageSpec = (row) => {
  ElMessageBox.confirm(
    `是否要管理商品"${row.ProductName}"的规格？`,
    '管理规格',
    {
      confirmButtonText: '前往管理',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    router.push(`/product/spec/${row.ProductId}`)
  })
}

// 删除商品
const handleDeleteProduct = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除商品"${row.productName}"吗？此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        center: true
      }
    )

    await deleteProduct(row.productId)
    const index = productList.value.findIndex(it => it.productId === row.productId)
    productList.value.splice(index, 1)
    ElMessage.success('删除成功')
  } catch (error) {

  }
}

// 批量删除
const handleDeleteBatch = async () => {
  if (selectedRows.value.length === 0) return

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个商品吗？此操作不可恢复！`,
      '批量删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        center: true
      }
    )

    const productIds = selectedRows.value.map(item => item.productId)
    // 这里调用批量删除接口
    let ids = productIds.join(',')
    await deleteBatchProducts(ids)

    selectedRows.value.forEach(item => {
      const index = productList.value.findIndex(it => it.productId === item.productId)
      productList.value.splice(index, 1)

    })
    selectedRows.value = []
    ElMessage.success(`成功删除 ${productIds.length} 个商品`)

  } catch (error) {

  }
}

// 修改状态
const handleStatusChange = async (row) => {
  /*
  try {
    // 这里调用API更新状态
    await updateProductStatus(row.ProductId, row.ProductStatus)
    ElMessage.success(row.ProductStatus === 1 ? '商品已上架' : '商品已下架')
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新失败')
    // 回滚状态
    row.ProductStatus = row.ProductStatus === 1 ? 0 : 1
  }
    */
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

// API调用
const fetchProductList = async () => {
  try {
    loading.value = true

    const appType = userStore.userInfo.appType
    const businessId = userStore.userInfo.businessId

    let params = {
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
      appType: appType,
      businessId: businessId
    }

    if (filterForm.productName !== '')
      params.productName = filterForm.productName;
    if (filterForm.productStatus !== '')
      params.productStatus = filterForm.productStatus;
    if (filterForm.categoryId !== '') {
      let categorys = filterForm.categoryId

      let categorylist = categorys.map(item => ({
        treepath: item.join('.'),
        exist: 0
      }));

      //再循环留下最末端节点 
      let templist = categorylist.map(it => ({ treepath: it.treepath }))
      for (let it of categorylist) {
        let treepath = it.treepath + '.'

        for (let it1 of templist) {
          if (it1.treepath.includes(treepath)) {
            it.exist = 1
            break
          }
        }
      }

      categorylist = categorylist.filter(it => it.exist == 0)

      categorylist = categorylist.map(item => item.treepath).join(',')

      params.categoryIds = categorylist

    }





    const res = await getProductPageList(params)
    productList.value = res.result || []
    pagination.total = res.count
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const fetchCategoryOptions = async () => {
  try {
    const appType = userStore.userInfo.appType
    const businessId = userStore.userInfo.businessId
    let params = { appType: appType, businessId: businessId }
    const res = await getCategoryOptions(params)
    categoryOptions.value = res.result || []
  } catch (error) {

  }
}

// 生命周期
onMounted(() => {
  fetchCategoryOptions()
  fetchProductList()
})
</script>

<style lang="scss" scoped>
.product-management {
  padding: 16px;

  .product-container {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e4e7ed;
    background: #f8fafc;

    .left-operations {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .right-search {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
  }

  .table-section {
    padding: 0;

    .product-image-container {
      display: flex;
      justify-content: center;
      align-items: center;

      .product-image {
        width: 60px;
        height: 60px;
        border-radius: 6px;
        border: 1px solid #f0f2f5;
        transition: all 0.2s ease;

        &:hover {
          border-color: #409eff;
          transform: scale(1.05);
        }
      }

      .image-error {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        color: #909399;
        border-radius: 4px;

        .el-icon {
          font-size: 16px;
          margin-bottom: 4px;
        }

        .error-text {
          font-size: 11px;
        }
      }

      .image-loading {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        color: #c0c4cc;
      }
    }

    .product-info {
      .product-name {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 6px;
        line-height: 1.4;
      }

      .product-category {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }
    }

    .product-price {
      .current-price {
        font-size: 16px;
        font-weight: 600;
        color: #f56c6c;
        margin-bottom: 4px;
      }

      .original-price {
        font-size: 12px;
        color: #909399;
      }
    }

    .stock-sales {

      .stock,
      .sales {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 4px;
        font-size: 12px;
        color: #606266;

        .el-icon {
          color: #409eff;
          font-size: 13px;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .create-time {
      font-size: 12px;
      color: #606266;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;

      .action-btn {
        width: 32px;
        height: 32px;
        padding: 0;

        .el-icon {
          font-size: 14px;
        }
      }
    }

    .pagination-section {
      padding: 16px 20px;
      display: flex;
      justify-content: center;
      border-top: 1px solid #e4e7ed;
      background: #fafafa;
    }

    :deep(.el-table) {
      .el-table__header-wrapper {
        border-bottom: 1px solid #e4e7ed;
      }

      .el-table__body-wrapper {
        tr {
          td {
            border-bottom: 1px solid #f0f2f5;
            padding: 12px 0;
          }

          &:hover {
            td {
              background-color: #f5f9ff;
            }
          }
        }
      }
    }

    :deep(.el-empty) {
      padding: 60px 0;

      .el-empty__image {
        width: 120px;
        height: 120px;
      }

      .el-empty__description {
        margin-top: 16px;
        font-size: 14px;
        color: #606266;
      }
    }
  }

  .product-detail-content {
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 10px;

    .detail-section {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #e4e7ed;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .info-item {
          display: flex;
          align-items: center;

          .info-label {
            font-size: 14px;
            color: #606266;
            min-width: 80px;
          }

          .info-value {
            font-size: 14px;
            color: #303133;
            font-weight: 500;
          }
        }
      }

      .image-section {
        display: flex;
        justify-content: center;
        padding: 16px 0;
      }

      .rich-content-wrapper {
        border: 1px solid #e4e7ed;
        border-radius: 6px;
        padding: 16px;
        background: #ffffff;
        min-height: 100px;
        max-height: 400px;
        overflow-y: auto;

        .rich-content {
          font-size: 14px;
          line-height: 1.6;

          :deep(img) {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 8px 0;
          }

          :deep(p) {
            margin: 8px 0;
          }

          :deep(h1),
          :deep(h2),
          :deep(h3),
          :deep(h4) {
            margin: 16px 0 8px 0;
          }
        }
      }
    }
  }

  :deep(.el-dialog) {
    border-radius: 8px;

    .el-dialog__header {
      padding: 16px 20px;
      border-bottom: 1px solid #e4e7ed;
      background: #f8fafc;
      border-radius: 8px 8px 0 0;

      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .el-dialog__body {
      padding: 20px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .el-dialog__footer {
      padding: 16px 20px;
      border-top: 1px solid #e4e7ed;
      background: #fafafa;
      border-radius: 0 0 8px 8px;
    }
  }
}
</style>