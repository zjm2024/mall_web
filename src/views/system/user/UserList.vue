<template>
  <div class="user-management">
    <!-- 整体容器 -->
    <div class="user-container">
      <!-- 头部：操作按钮和搜索区域 -->
      <div class="header-section">
        <div class="left-operations">
          <el-button type="primary" @click="handleAdduser" size="large">


            <el-icon>
              <Plus />
            </el-icon>添加用户
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
          <el-input v-model="filterForm.searchKey" placeholder="用户名、姓名、电话号码" clearable size="large"
            style="width: 180px; margin-right: 12px;" @keyup.enter="handleSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>



          <el-select v-model="filterForm.status" placeholder="用户状态" clearable size="large"
            style="width: 120px; margin-right: 12px;">
            <el-option label="全部" value="" />
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
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
        <el-table :data="userList" v-loading="loading" style="width: 100%;" heigth="600"
          @selection-change="handleSelectionChange" :header-cell-style="{
            background: '#f5f7fa',
            color: '#303133',
            fontWeight: 'bold',
            height: '56px'
          }">
          <el-table-column type="selection" width="55" align="center" />

          <!-- 用户头像 -->
          <el-table-column label="用户头像" width="120" align="center">
            <template #default="{ row }">
              <el-image :src="row.avatar || '/default-user.png'" :preview-src-list="[row.avatar]" fit="cover"
                class="user-image">
                <template #error>
                  <div class="image-error">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>

          <!-- 超管 -->
          <el-table-column label="超级管理员" min-width="120">
            <template #default="{ row }">
              <el-tag :type="row.isSuperAdmin === 1 ? 'error' : 'success'" size="large">
                {{ row.isSuperAdmin === 1 ? '超管' : '普通' }}
              </el-tag>
            </template>
          </el-table-column>


          <!-- 账号 -->
          <el-table-column prop="userNo" label="账号" min-width="120">
            <template #default="{ row }">
              <div class="user-info">
                <div class="user-name">{{ row.userNo }}</div>

              </div>
            </template>
          </el-table-column>

          <!-- 商户号 -->
          <el-table-column prop="userNo" label="商户号" min-width="120">
            <template #default="{ row }">
              <div class="user-info">
                <div class="user-name">{{ row.businessId }}</div>

              </div>
            </template>
          </el-table-column>

          <!-- 用户昵称 -->
          <el-table-column prop="userName" label="用户昵称" min-width="150">
            <template #default="{ row }">
              <div class="user-info">
                <div class="user-name">{{ row.userName }}</div>
                <div class="user-category">
                  <el-tag size="small" type="info">

                  </el-tag>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 用户姓名 -->
          <el-table-column label="姓名" width="150" align="center">
            <template #default="{ row }">
              {{ row.realName }}
            </template>
          </el-table-column>

          <!-- 手机号码 -->
          <el-table-column label="手机号码" width="150" align="center">
            <template #default="{ row }">
              {{ row.phone }}
            </template>
          </el-table-column>

          <!-- 邮箱地址 -->
          <el-table-column label="邮箱地址" width="150" align="center">
            <template #default="{ row }">
              {{ row.email }}
            </template>
          </el-table-column>

          <!-- 状态 -->
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="large">
                {{ row.status === 1 ? '正常' : '禁用' }}
              </el-tag>
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
                <el-button type="primary" link size="large" @click="handleEdituser(row)">
                  <el-icon>
                    <Edit />
                  </el-icon>编辑
                </el-button>

                <el-button type="primary" link size="large" @click="handleViewDetail(row)">
                  <el-icon>
                    <View />
                  </el-icon>详情
                </el-button>

                <el-button type="primary" link size="large" @click="handleResetPassword(row)">
                  <el-icon>
                    <SetUp />
                  </el-icon>重置密码
                </el-button>

                <el-popconfirm title="确定要删除这个用户吗？" confirm-button-text="确定" cancel-button-text="取消"
                  @confirm="handleDeleteuser(row)">
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
        <el-empty v-if="!loading && userList.length === 0" description="暂无用户数据" :image-size="160" />
      </div>




    </div>

    <!-- 添加/编辑用户对话框 -->
    <user-dialog ref="userdialogRef" :mode="dialogMode" @success="handleDialogSuccess" />

    <!-- 重置密码对话框 -->
    <userModPassword-dialog ref="usermodpassworddialogRef" :mode="resetdialogMode" />

  </div>



</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import { ElMessage, ElMessageBox } from 'element-plus'
import UserDialog from './UserDialog.vue'
import UserModPasswordDialog from './UserModPasswordDialog.vue'
import { formatDate } from '@/utils/common'
import userApi from '@/api/modules/user'

const router = useRouter()

// 数据
const loading = ref(false)
const userList = ref([])
const selectedRows = ref([])
const userdialogRef = ref(null)
const usermodpassworddialogRef = ref(null)
const dialogMode = ref('add')
const resetdialogMode = ref('add')
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
const fetchuserList = async () => {
  try {
    loading.value = true

    let params = {
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
      appType: 1
    }

    if (filterForm.searchKey !== '')
      params.searchKey = filterForm.searchKey;
    if (filterForm.status !== '')
      params.status = filterForm.status;


    const res = await userApi.getUserPageList(params)
    userList.value = res.result || []
    pagination.total = res.count || 0
  } catch (error) {

    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const fetchCategoryOptions = async () => {
  try {
    const res = await userApi.getCategoryOptions()
    categoryOptions.value = res.data || []
  } catch (error) {
    console.error('获取分类选项失败:', error)
  }
}



// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchuserList()
}

// 重置
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  pagination.currentPage = 1
  fetchuserList()
}

// 添加用户
const handleAdduser = () => {
  dialogMode.value = 'add'
  let user = {
    adminId: 0,
    userNo: '',
    userName: '',
    businessId: 0,
    realName: '',
    phone: '',
    email: '',
    avatar: '',
    status: 1,
    isSuperAdmin: 0,
    appType: 1
  }
  userdialogRef.value.openDialog(user)


}

// 对话框成功回调
const handleDialogSuccess = (res) => {
  let row = userList.value.find(it => it.adminId === res.adminId)
  if (row) {
    row.userNo = res.userNo;
    row.userName = res.userName;
    row.realName = res.realName;
    row.avatar = res.avatar;
    row.phone = res.phone;
    row.email = res.email;
    row.status = res.status;
    row.isSuperAdmin = res.isSuperAdmin;
  }
  else {
    userList.value.splice(0, 0, res);
  }
}

// 编辑用户
const handleEdituser = (user) => {
  dialogMode.value = 'edit'
  userdialogRef.value.openDialog(user)
}

// 查看用户
const handleViewDetail = (row) => {
  router.push(`/user/detail/${row.userId}`)
}

// 重置密码
const handleResetPassword = (row) => {
  resetdialogMode.value = 'reset'
  usermodpassworddialogRef.value.openDialog(row)
}

// 删除用户
const handleDeleteuser = async (user) => {
  try {
    await userApi.deleteUser(user.adminId)
    let index = userList.value.findIndex(it => it.adminId == user.adminId)
    userList.value.splice(index, 1)
    ElMessage.success('删除成功')

  } catch (error) {
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

    const userIds = selectedRows.value.map(item => item.userId)
    await userApi.batchDeleteusers({ userIds })

    ElMessage.success('批量删除成功')
    selectedRows.value = []
    fetchuserList()
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
    await userApi.updateuser(row.userId, {
      userStatus: row.userStatus
    })
    ElMessage.success(row.userStatus === 1 ? '商品已上架' : '商品已下架')
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新失败')
    // 回滚状态
    row.userStatus = row.userStatus === 1 ? 0 : 1
  }
}

// 表格选择
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 分页
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchuserList()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchuserList()
}

// 刷新列表
const refreshList = () => {
  fetchuserList()
}

// 生命周期
onMounted(() => {
  // fetchCategoryOptions()
  fetchuserList()
})
</script>

<style lang="scss" scoped>
.user-management {
  padding: 20px;

  .user-container {
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

    .user-image {
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

    .user-info {
      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 6px;
      }

      .user-category {
        .el-tag {
          font-size: 12px;
        }
      }
    }

    .user-price {
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