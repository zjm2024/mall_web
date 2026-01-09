<template>
  <div class="order-list">
    <!-- 整体容器 -->
    <div class="order-container">
      <!-- 头部：操作按钮和搜索区域 -->
      <div class="header-section">
        <div class="left-operations">
          <el-button type="primary" @click="handleAddOrder" size="large">
            <el-icon>
              <Plus />
            </el-icon>添加订单
          </el-button>
          <el-button @click="refreshList" size="large">
            <el-icon>
              <Refresh />
            </el-icon>刷新
          </el-button>
          <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0" size="large">
            <el-icon>
              <Delete />
            </el-icon>批量删除
          </el-button>
        </div>

        <div class="right-search">
          <el-input v-model="filterForm.searchKey" placeholder="订单号、客户姓名、联系方式" clearable size="large"
            style="width: 180px; margin-right: 12px;" @keyup.enter="handleSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>

          <el-select v-model="filterForm.status" placeholder="订单状态" clearable size="large"
            style="width: 120px; margin-right: 12px;">
            <el-option label="全部" value="" />
            <el-option label="待付款" value="" />
            <el-option label="待发货" value="" />
            <el-option label="已发货" value="" />
            <el-option label="已完成" value="" />
            <el-option label="已取消" value="" />
          </el-select>

          <el-button type="primary" @click="handleSearch" size="large">
            查询
          </el-button>
          <el-button @click="handleReset" size="large">
            重置
          </el-button>
        </div>
      </div>

      <!-- 订单表格区域 -->
      <div class="table-section">
        <el-table :data="orderList" v-loading="loading" style="width: 100%;" 
          @selection-change="handleSelectionChange" :header-cell-style="{
            background: '#f5f7fa',
            color: '#303133',
            fontWeight: 'bold',
            height: '56px'
          }">
          <el-table-column type="selection" width="55" align="center" />

          <!-- 订单编号 -->
          <el-table-column prop="orderNo" label="订单编号" min-width="150" align="center">
            <template #default="{}">
              <div class="order-info">
                <div class="order-no">{{}}</div>
              </div>
            </template>
          </el-table-column>

          <!-- 客户信息 -->
          <el-table-column prop="customerName" label="客户姓名" min-width="120" align="center">
            <template #default="{}">
              <div class="customer-info">
                <div class="customer-name">{{}}</div>
                <div class="customer-phone">{{}}</div>
              </div>
            </template>
          </el-table-column>

          <!-- 订单金额 -->
          <el-table-column prop="totalAmount" label="订单金额" min-width="100" align="center">
            <template #default="{}">
              <div class="order-price">
                <div class="total-price">¥{{}}</div>
              </div>
            </template>
          </el-table-column>

          <!-- 订单状态 -->
          <el-table-column prop="status" label="订单状态" width="120" align="center">
            <template #default="{}">
              <el-tag :type="getStatusType()" size="large">
                {{ getStatusText() }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 支付状态 -->
          <el-table-column prop="paymentStatus" label="支付状态" width="120" align="center">
            <template #default="{}">
              <el-tag :type="getPaymentType()" size="large">
                {{ getPaymentText() }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 发货状态 -->
          <el-table-column prop="shippingStatus" label="发货状态" width="120" align="center">
            <template #default="{}">
              <el-tag :type="getShippingType()" size="large">
                {{ getShippingText() }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 创建时间 -->
          <el-table-column prop="createTime" label="创建时间" width="180" align="center">
            <template #default="{}">
              {{ formatDate() }}
            </template>
          </el-table-column>

          <!-- 更新时间 -->
          <el-table-column prop="updateTime" label="更新时间" width="180" align="center">
            <template #default="{}">
              {{ formatDate() }}
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="280" fixed="right" align="center">
            <template #default="{}">
              <div class="action-buttons">
                <el-button type="primary" link size="large" @click="handleViewDetail()">
                  <el-icon>
                    <View />
                  </el-icon>详情
                </el-button>

                <el-button type="primary" link size="large" @click="handleEditOrder()">
                  <el-icon>
                    <Edit />
                  </el-icon>编辑
                </el-button>

                <el-button type="success" link size="large" @click="handleProcessOrder()">
                  <el-icon>
                    <Operation />
                  </el-icon>处理
                </el-button>

                <el-popconfirm title="确定要删除这个订单吗？" confirm-button-text="确定" cancel-button-text="取消"
                  @confirm="handleDeleteOrder()">
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
        <el-empty v-if="!loading && orderList.length === 0" description="暂无订单数据" :image-size="160" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/common'
import { Plus, Refresh, Delete, Search, Edit, View, Operation } from '@element-plus/icons-vue'

const router = useRouter()

// 数据
const loading = ref(false)
const orderList = ref([])
const selectedRows = ref([])

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

// 订单状态映射
const statusMap = {
  pending: { text: '待付款', type: 'warning' },
  processing: { text: '待发货', type: 'primary' },
  shipped: { text: '已发货', type: 'info' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'danger' }
}

// 支付状态映射
const paymentStatusMap = {
  unpaid: { text: '未支付', type: 'warning' },
  paid: { text: '已支付', type: 'success' },
  refunded: { text: '已退款', type: 'info' }
}

// 发货状态映射
const shippingStatusMap = {
  pending: { text: '待发货', type: 'warning' },
  shipped: { text: '已发货', type: 'primary' },
  delivered: { text: '已送达', type: 'success' }
}

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  return statusMap[status]?.text || status
}

// 获取支付类型
const getPaymentType = (status) => {
  return paymentStatusMap[status]?.type || 'info'
}

// 获取支付文本
const getPaymentText = (status) => {
  return paymentStatusMap[status]?.text || status
}

// 获取发货类型
const getShippingType = (status) => {
  return shippingStatusMap[status]?.type || 'info'
}

// 获取发货文本
const getShippingText = (status) => {
  return shippingStatusMap[status]?.text || status
}

// 获取订单列表
const fetchOrderList = async () => {
  try {
    loading.value = true

    let params = {
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize
    }

    if (filterForm.searchKey)
      params.searchKey = filterForm.searchKey
    if (filterForm.status)
      params.status = filterForm.status

    // 这里应该是真实的API调用，模拟数据
    const res = await orderApi.getOrderList(params)
    orderList.value = res.result || []
    pagination.total = res.count || 0
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchOrderList()
}

// 重置
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  pagination.currentPage = 1
  fetchOrderList()
}

// 添加订单
const handleAddOrder = () => {
  alert('功能开发中...')
}

// 编辑订单
const handleEditOrder = (order) => {
  alert('功能开发中...')
}

// 查看订单详情
const handleViewDetail = () => {
  alert('功能开发中...')
}

// 处理订单
const handleProcessOrder = () => {
  alert('注册功能开发中...')
  
}

// 删除订单
const handleDeleteOrder = async (order) => {
  try {
    await orderApi.deleteOrder(order.id)
    const index = orderList.value.findIndex(item => item.id === order.id)
    if (index > -1) {
      orderList.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除订单失败:', error)
    ElMessage.error('删除订单失败')
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个订单吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const orderIds = selectedRows.value.map(item => item.id)
    await orderApi.batchDeleteOrders({ orderIds })

    ElMessage.success('批量删除成功')
    selectedRows.value = []
    fetchOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 表格选择
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 分页
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchOrderList()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchOrderList()
}

// 刷新列表
const refreshList = () => {
  fetchOrderList()
}


// 生命周期
onMounted(() => {
  fetchOrderList()
})
</script>

<style lang="scss" scoped>
.order-list {
  padding: 20px;

  .order-container {
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
      gap: 12px;
    }
  }

  .table-section {
    padding: 0;

    .order-info {
      .order-no {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 6px;
      }
    }

    .customer-info {
      .customer-name {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 4px;
      }

      .customer-phone {
        font-size: 12px;
        color: #909399;
      }
    }

    .order-price {
      .total-price {
        font-size: 16px;
        font-weight: 600;
        color: #f56c6c;
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