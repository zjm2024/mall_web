<template>
  <div class="shop-management">
    <!-- 整体容器 -->
    <div class="shop-container">
      <!-- 头部：操作按钮和搜索区域 -->
      <div class="header-section">
        <div class="left-operations">
          <el-button type="primary" @click="handleAddshop" size="large">


            <el-icon>
              <Plus />
            </el-icon>添加商户
          </el-button>
          <el-button @click="refreshList" size="large">
            <el-icon>
              <Refresh />
            </el-icon>刷新
          </el-button>

        </div>

        <div class="right-search">
          <el-input v-model="filterForm.searchKey" placeholder="店铺名" clearable size="large"
            style="width: 180px; margin-right: 12px;" @keyup.enter="handleSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>



          <el-select v-model="filterForm.status" placeholder="店铺状态" clearable size="large"
            style="width: 120px; margin-right: 12px;">
            <el-option label="全部" value="" />
            <el-option label="审批" :value="0" />
            <el-option label="上线" :value="1" />
            <el-option label="下线" :value="2" />
            <el-option label="删除" :value="3" />
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
        <el-table :data="shopList" v-loading="loading" style="width: 100%;" @selection-change="handleSelectionChange"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#303133',
            fontWeight: 'bold',
            height: '56px'
          }" height="100%">
          <el-table-column type="selection" width="55" align="center" />





          <!-- 商户号 -->
          <el-table-column prop="shopNo" label="商户号" width="150">
            <template #default="{ row }">
              <div class="shop-info">
                <div class="shop-name">{{ row.businessNo }}</div>

              </div>
            </template>
          </el-table-column>




          <!-- 商户名称 -->
          <el-table-column label="商户名称" align="center">
            <template #default="{ row }">
              {{ row.businessName }}
            </template>
          </el-table-column>


          <!-- 认证状态 -->
          <el-table-column prop="status" label="认证状态" width="100" align="center">
            <template #default="{ row }">

              <el-tag type="info" v-if="row.status === 0">审批</el-tag>
              <el-tag type="success" v-if="row.status === 1">上线</el-tag>
              <el-tag type="warning" v-if="row.status === 2">下线</el-tag>
              <el-tag type="danger" v-if="row.status === 3">删除</el-tag>

            </template>
          </el-table-column>

          <!-- 创建时间 -->
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="300" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" link size="large" @click="handleEditshop(row)">
                  <el-icon>
                    <Edit />
                  </el-icon>编辑
                </el-button>

                <el-button type="primary" link size="large" @click="handleViewDetail(row)">
                  <el-icon>
                    <View />
                  </el-icon>详情
                </el-button>



                <el-popconfirm title="确定要删除这个商户吗？" confirm-button-text="确定" cancel-button-text="取消"
                  @confirm="handleDeleteshop(row)">
                  <template #reference>
                    <el-button type="danger" link size="large">
                      <el-icon>
                        <Delete />
                      </el-icon>删除
                    </el-button>
                  </template>
                </el-popconfirm>


              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <!-- 空状态 -->
        <el-empty v-if="!loading && shopList.length === 0" description="暂无商户数据" :image-size="160" />
      </div>




    </div>

    <!-- 添加/编辑店铺对话框 -->
    <shop-dialog ref="shopdialogRef" :mode="dialogMode" @success="handleDialogSuccess" />


  </div>



</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import { ElMessage, ElMessageBox } from 'element-plus'
import ShopDialog from './ShopDialog.vue'
import { formatDate } from '@/utils/common'
import shopApi from '@/api/modules/shop'

const router = useRouter()

// 数据
const loading = ref(false)
const shopList = ref([])
const selectedRows = ref([])
const shopdialogRef = ref(null)
const dialogMode = ref('add')
// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 筛选表单
const filterForm = reactive({
  searchKey: '',
  status: '',
})

// 方法
const fetchshopList = async () => {
  try {
    loading.value = true

    let params = {
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
      appType: 0
    }

    if (filterForm.searchKey !== '')
      params.searchKey = filterForm.searchKey;
    if (filterForm.status !== '')
      params.status = filterForm.status;


    const res = await shopApi.getShopPageList(params)
    shopList.value = res.result || []
    pagination.total = res.count || 0
  } catch (error) {

    ElMessage.error('获取商户列表失败')
  } finally {
    loading.value = false
  }
}




// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchshopList()
}

// 重置
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  pagination.currentPage = 1
  fetchshopList()
}

// 添加店铺
const handleAddshop = () => {
  dialogMode.value = 'add'
  let shop = {
    businessId: 0,
    businessNo: '',
    businessName: '',
    status: 1,
    appType: 0
  }
  shopdialogRef.value.openDialog(shop)


}

// 对话框成功回调
const handleDialogSuccess = (res) => {
  let row = shopList.value.find(it => it.businessId === res.businessId)
  if (row) {
    row.businessNo = res.businessNo;
    row.businessName = res.businessName;
    row.status = res.status;
  }
  else {
    shopList.value.splice(0, 0, res);
  }
}

// 编辑店铺
const handleEditshop = (row) => {
  dialogMode.value = 'edit'
  shopdialogRef.value.openDialog(row)
}

// 查看店铺
const handleViewDetail = (row) => {
  dialogMode.value = 'detail'
  shopdialogRef.value.openDialog(row)

}



// 删除店铺
const handleDeleteshop = async (shop) => {
  try {
    await shopApi.deleteShop(shop.businessId)
    let index = shopList.value.findIndex(it => it.businessId == shop.businessId)
    shopList.value.splice(index, 1)
    ElMessage.success('删除成功')

  } catch (error) {
    ElMessage.error('删除失败')
  }
}



// 表格选择
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 分页
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchshopList()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchshopList()
}

// 刷新列表
const refreshList = () => {
  fetchshopList()
}

// 生命周期
onMounted(() => {
  fetchshopList()
})
</script>

<style lang="scss" scoped>
.shop-management {
  padding: 20px;

  .shop-container {
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
    height: calc(100vh - 300px);

    .shop-image {
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

    .shop-info {
      .shop-name {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 6px;
      }

      .shop-category {
        .el-tag {
          font-size: 12px;
        }
      }
    }

    .shop-price {
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