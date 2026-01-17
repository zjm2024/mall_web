<template>
  <div class="order-list">
    <!-- 整体容器 -->
    <div class="order-container">
      <!-- 头部：操作按钮和搜索区域 -->
      <div class="header-section">
        <div class="left-operations">
          <el-button @click="refreshList" size="large">
            <el-icon>
              <Refresh />
            </el-icon>刷新
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
            <el-option label="全部" value="All" />
            <el-option label="待处理" :value="OrderStatus.PENDING" />
            <el-option label="已发货" :value="OrderStatus.SHIPPED" />
            <el-option label="已完成" :value="OrderStatus.COMPLETED" />
            <el-option label="已关闭" :value="OrderStatus.CLOSED" />
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
            <template #default="{row}">
              <div class="order-info">
                <div class="order-no">{{row.orderNo}}</div>
              </div>
            </template>
          </el-table-column>

          <!-- 创建时间 -->
          <el-table-column prop="createTime" label="创建时间" width="180" align="center">
            <template #default="{row}">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>

          <!-- 订单状态 -->
          <el-table-column prop="status" label="订单状态" width="120" align="center">
            <template #default="{row}">
              <el-tag :type="getOrderStatusType(row.orderStatus)" size="large">
                {{ getOrderStatusText(row.orderStatus) }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 订单金额 -->
          <el-table-column prop="totalAmount" label="订单金额" min-width="100" align="center">
            <template #default="{row}">
              <div class="order-price">
                <div class="amount-price">¥{{row.totalPayAmount}}</div>
                <div class="total-price">原价:<b>¥{{row.totalAmount}}</b></div>

              </div>
            </template>
          </el-table-column>

          <!-- 支付类型 -->
          <el-table-column prop="PaymentMethod" label="支付类型" min-width="100" align="center">
            <template #default="{row}">
              {{ getPaymentMethodText(row.paymentMethod) }}
            </template>
          </el-table-column>

          <!-- 支付状态 -->
          <el-table-column prop="paymentStatus" label="支付状态" width="120" align="center">
            <template #default="{row}">
              <el-tag :type="getPayStatusType(row.payStatus)" size="large">
                {{ getPayStatusText(row.payStatus) }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 客户信息 -->
          <el-table-column prop="customerName" label="客户姓名" min-width="120" align="center">
            <template #default="{row}">
              <div class="customer-info">
                <div class="customer-id">{{row.personalID}}</div>
                <div class="customer-name">{{row.receiverName}}</div>
                <div class="customer-phone">{{row.receiverPhone}}</div>
              </div>
            </template>
          </el-table-column>

          <!-- 风险状态 -->
          <el-table-column prop="riskStatus" label="风险状态" width="120" align="center">
            <template #default="{row}">
              <el-tag :type="getRiskLevelType(row.riskLevel)" size="large">
                {{ getRiskLevelText(row.riskLevel) }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 发货信息 -->
          <el-table-column prop="customerName" label="发货信息" min-width="120" align="center">
            <template #default="{row}">
              <div class="address-info">
                <div v-if="row.ShippingNo" class="express-no">
                  {{ row.shippingNo }}
                </div>
                <div class="detail-address">{{ row.receiverAddress }}</div>
              </div>
            </template>
          </el-table-column>

          <!-- 发货状态 -->
          <el-table-column prop="shippingStatus" label="发货状态" width="120" align="center">
            <template #default="{row}">
              <el-tag v-if="row.shippingNo" type="primary" size="large">
                已发货
              </el-tag>
              <el-tag v-else type="warning" size="large">
                待发货
              </el-tag>
            </template>
          </el-table-column>

          <!-- 备注信息 -->
          <el-table-column prop="orderRemark" label="备注信息" min-width="100" align="center">
            <template #default="{row}">
              <div class="order-price">
                <!-- 过滤掉包含"原订单备注："的文本 -->
                <template v-if="row.remark">
                  <span v-html="formatRemark(row.remark)"></span>
                </template>
                <template v-else>-</template>
              </div>
            </template>
          </el-table-column>



          <!-- 更新时间 -->
          <el-table-column prop="updateTime" label="更新时间" width="180" align="center">
            <template #default="{row}">
              {{ formatDate(row.updateTime) }}
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="210" fixed="right" align="center">
            <template #default="{row}">
              <div class="action-buttons">
                <el-button type="primary" link size="large" @click="handleViewDetail(row)">
                  <el-icon>
                    <View />
                  </el-icon>详情
                </el-button>

                <el-button type="primary" link size="large" @click="handleEditOrder(row)">
                  <el-icon>
                    <Edit />
                  </el-icon>编辑
                </el-button>

                <el-popconfirm title="确定要处理这个订单吗？" confirm-button-text="确定" cancel-button-text="取消"
                  @confirm="handleProcessOrder(row)">
                  <template #reference>
                    <el-button type="success" link size="large">
                      <el-icon>
                        <Operation />
                      </el-icon>处理
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

    <!-- 添加/编辑订单对话框 -->
    <order-dialog ref="orderDialogRef" :mode="dialogMode" @success="handleDialogSuccess" />

    <!-- 订单详情对话框 -->
    <order-detail-dialog ref="orderDetailDialogRef" />

    <!-- 订单发货对话框 -->
    <order-ship-dialog ref="orderShipDialogRef" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/common'
import { Plus, Refresh, Delete, Search, Edit, View, Operation } from '@element-plus/icons-vue'
import orderApi from '@/api/modules/order'
import {
  OrderStatus,
  PayStatus,
  RiskLevel,
  PaymentMethod,
  getOrderStatusText,
  getOrderStatusType,
  getPayStatusText,
  getPayStatusType,
  getRiskLevelText,
  getRiskLevelType,
  getPaymentMethodText
} from '@/constants/order'
import { useUserStore } from '@/stores/user'
// 导入弹窗组件
import OrderDialog from './OrderDealDialog.vue' //订单处理对话框(改动)
import OrderDetailDialog from './OrderDetailDialog.vue' //订单详情对话框
import OrderShipDialog from './OrderShipDialog.vue' //发货处理对话框




const router = useRouter()

// 数据
const userStore = useUserStore()
const loading = ref(false)
const orderList = ref([])
const selectedRows = ref([])
const orderDialogRef = ref(null)
const orderDetailDialogRef = ref(null)
const orderShipDialogRef = ref(null)
const dialogMode = ref('add')

// 自动刷新相关
const autoRefreshTimer = ref(null)
const lastActivityTime = ref(Date.now())

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

  // 获取订单列表
  const fetchOrderList = async () => {
  try {
    loading.value = true

    // 获取用户信息 - 确保userStore有数据
    if (!userStore.userInfo || !userStore.userInfo.businessId) {
      console.error('[OrderList] 用户信息缺失:', userStore.userInfo)
      ElMessage.error('用户信息异常，请重新登录')
      return
    }
    
    const appType = userStore.userInfo.appType
    const businessId = userStore.userInfo.businessId
    
    let params = {
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
      appType: appType,
      businessId: businessId  // 添加缺失的关键参数
    }

    // 处理搜索关键字
    if (filterForm.searchKey)
      params.searchKey = filterForm.searchKey

    // 处理订单状态筛选 - 只有当值不是空字符串、null、undefined 或 'All' 时才传递
    if (filterForm.status !== '' && filterForm.status !== null && filterForm.status !== undefined && filterForm.status !== 'All')
      params.orderStatus = filterForm.status

    console.log('[OrderList] fetchOrderList params:', params)
    console.log('[OrderList] userStore info:', {
      userInfo: userStore.userInfo,
      isUserStoreReady: !!userStore.userInfo,
      businessId: userStore.userInfo?.businessId,
      appType: userStore.userInfo?.appType
    })

    // 如果使用真实 API，取消下面注释并注释掉上面的模拟代码
      const res = await orderApi.getOrderPageList(params)
      
      // 处理方法参考request.js拦截器的期望格式
      if (res && res.flag === 1) {
        // 标准的成功响应格式
        orderList.value = res.result || []
        pagination.total = res.count || 0
      } else if (Array.isArray(res)) {
        // 直接返回数组
        orderList.value = res
        pagination.total = res.length
      } else if (res && res.result !== undefined) {
        // 有result但没有flag
        orderList.value = res.result || []
        pagination.total = res.count || 0
      } else {
        console.warn('[OrderList] 无法识别的响应格式:', res)
        orderList.value = []
        pagination.total = 0
      }
      
      console.log('[OrderList] 最终数据:', {
        orderListLength: orderList.value.length,
        total: pagination.total,
        firstItem: orderList.value[0]
      })
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

//刷新列表
// const refreshList = () => {
//   fetchOrderList()
//   ElMessage.success('已刷新')
// }


// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchOrderList()
  if (filterForm.searchKey || filterForm.status) {
    ElMessage.info(`正在搜索: ${filterForm.searchKey || '全部订单'} - ${filterForm.status || '全部状态'}`)
  }
}

// 重置
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  pagination.currentPage = 1
  fetchOrderList()
  ElMessage.success('已重置筛选条件')
}

// 编辑订单
const handleEditOrder = (order) => {
  dialogMode.value = 'edit'
  orderDialogRef.value.openDialog(order)
}

// 查看订单详情
const handleViewDetail = (order) => {
  orderDetailDialogRef.value.openDialog(order)
}

// 处理订单
const handleProcessOrder = (order) => {
  orderShipDialogRef.value.openDialog(order)
}

// 表格选择
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 对话框成功回调
const handleDialogSuccess = (res) => {
  fetchOrderList()
}

// 格式化备注显示，隐藏原订单备注
const formatRemark = (remark) => {
  if (!remark) return '-'
  
  // 使用正则表达式找到并移除"原订单备注："及其后面的内容
  // 保留取消原因和用户自定义备注，但移除"原订单备注："部分
  const parts = remark.split('---')
  const filteredParts = parts.filter(part => !part.includes('原订单备注：'))
  
  if (filteredParts.length === 0) return '-'
  
  return filteredParts.join('---')
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

// 刷新列表（类似于F5重新加载页面）
const refreshList = async () => {
  
  // 重置分页到第一页
  pagination.currentPage = 1
  
  // 重置筛选条件
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  
  // 记录用户活动
  recordUserActivity()
  
  // 重新获取数据
  await fetchOrderList()
  
  // 显示刷新提示
  ElMessage.success('页面已刷新')
}

// 执行自动刷新
const performAutoRefresh = async () => {
  
  // 重新获取数据
  await fetchOrderList()
  
  // 显示自动刷新提示
  ElMessage.success('页面自动刷新')
}


// 记录用户活动时间
const recordUserActivity = () => {
  lastActivityTime.value = Date.now()
}

// 开始自动刷新定时器
const startAutoRefresh = () => {
  // 清除可能存在的旧定时器
  if (autoRefreshTimer.value) {
    clearTimeout(autoRefreshTimer.value)
  }

  autoRefreshTimer.value = setInterval(() => {
    const now = Date.now()
    const timeSinceLastActivity = now - lastActivityTime.value

    // 如果超过五分钟——300秒（300000毫秒）没有用户活动，则刷新列表
    if (timeSinceLastActivity >= 300000) {
      console.log('[OrderList] 300秒无操作，执行自动刷新')
      // 重置分页到第一页
      pagination.currentPage = 1
      // 重置筛选条件
      Object.keys(filterForm).forEach(key => {
        filterForm[key] = ''
      })
      
      // 调用refreshList而不是直接fetchOrderList，确保有统一的loading提示
      performAutoRefresh()
    }
  }, 1000) // 每秒检查一次
}

// 停止自动刷新定时器
const stopAutoRefresh = () => {
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value)
    autoRefreshTimer.value = null
  }
}

// 设置用户活动监听器
const setupActivityListeners = () => {
  // 监听各种用户操作事件
  const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart']

  const handleActivity = () => {
    recordUserActivity()
  }

  // 添加用户活动事件监听
  events.forEach(event => {
    window.addEventListener(event, handleActivity, true)
  })

  // 返回清理函数，在组件卸载时使用
  return () => {
    events.forEach(event => {
      window.removeEventListener(event, handleActivity, true)
    })
  }
}

// 生命周期
let cleanupActivityListeners = null

onMounted(() => {
  console.log('[OrderList] onMounted - 开始加载订单列表')
  
  // 记录初始活动时间
  recordUserActivity()
  
  // 设置用户活动监听器并获取清理函数
  cleanupActivityListeners = setupActivityListeners()
  
  // 开始自动刷新定时器
  startAutoRefresh()
  
  fetchOrderList()
  
  // 延迟检查数据是否加载
  setTimeout(() => {
    console.log('[OrderList] 延迟检查 - orderList 长度:', orderList.value.length)
    console.log('[OrderList] 延迟检查 - orderList 数据:', orderList.value)
    console.log('[OrderList] 延迟检查 - loading 状态:', loading.value)
  }, 500)
})

// 组件卸载时清理资源
onUnmounted(() => {
  console.log('[OrderList] onUnmounted - 清理自动刷新资源')
  // 停止自动刷新
  stopAutoRefresh()
  // 清理事件监听器
  if (cleanupActivityListeners) {
    cleanupActivityListeners()
  }
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
      .amount-price {
        font-size: 16px;
        font-weight: 600;
        color: #f56c6c;
      }
      .total-price{
        font-size: 10px;
        color: #303133;
        text-decoration: line-through;
      }
    }

    .address-info{
      .express-no{
        font-size: 12px;
        font-weight: 600;
        color: #303133;
      }
      .detail-address {
        font-size: 10px;
        font-weight: 200;
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



