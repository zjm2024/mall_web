<template>
  <div class="category-management">
    <!-- 整体容器 -->
    <div class="category-container">
      <!-- 头部：操作按钮和搜索区域 -->
      <div class="header-section">
        <div class="left-operations">
          <el-button type="primary" @click="handleAddCategory" size="large">
            <el-icon>
              <Plus />
            </el-icon>添加分类
          </el-button>
          <el-button @click="refreshList" size="large">
            <el-icon>
              <Refresh />
            </el-icon>刷新
          </el-button>
        </div>

        <div class="right-search">
          <el-input v-model="filterForm.categoryName" placeholder="请输入分类名称" clearable size="large"
            style="width: 300px; margin-right: 12px;" @keyup.enter="handleSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>

          <el-select v-model="filterForm.status" placeholder="状态" clearable size="large"
            style="width: 120px; margin-right: 12px;">
            <el-option label="全部" value="" />
            <el-option label="显示" :value="1" />
            <el-option label="隐藏" :value="0" />
          </el-select>

          <el-button type="primary" @click="handleSearch" size="large">
            查询
          </el-button>
          <el-button @click="handleReset" size="large">
            重置
          </el-button>
        </div>
      </div>




      <!-- 分类表格区域 -->
      <div class="table-section">
        <el-table :data="categoryList" v-loading="loading" highlight-current-row row-key="categoryId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :header-cell-style="{
            background: '#f5f7fa',
            color: '#303133',
            fontWeight: 'bold',
            height: '56px'
          }" :cell-style="{ padding: '16px 0' }" style="width: 100%;">
          <!-- 分类名称 -->
          <el-table-column prop="categoryName" label="分类名称" min-width="300">
            <template #default="{ row }">
              <div class="category-name">
                <el-icon v-if="row.level === 1" color="#409eff" size="18">
                  <Folder />
                </el-icon>
                <el-icon v-if="row.level === 2" color="#67c23a" size="18">
                  <FolderOpened />
                </el-icon>
                <el-icon v-if="row.level >= 3" color="#e6a23c" size="18">
                  <Collection />
                </el-icon>
                <span style="margin-left: 12px; font-size: 14px;">{{ row.categoryName }}</span>
                <el-tag v-if="row.parentId === 0" size="small" type="info" style="margin-left: 12px;">
                  顶级分类
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <!-- 分类层级 -->
          <el-table-column prop="level" label="层级" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.Level === 1 ? 'primary' : row.Level === 2 ? 'success' : 'warning'" effect="light">
                第{{ row.level }}级
              </el-tag>
            </template>
          </el-table-column>


          <!-- 排序 -->
          <el-table-column label="排序" width="150" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.sortOrder" :min="0" :max="9999" style="width: 120px"
                @change="handleSortChange(row)" />
            </template>
          </el-table-column>

          <!-- 状态 -->
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0" size="large"
                @change="handleStatusChange(row)" />
            </template>
          </el-table-column>

          <!-- 创建时间 -->
          <el-table-column prop="createTime" label="创建时间" width="200">
            <template #default="{ row }">
              <span style="font-size: 13px;">{{ formatDate(row.createTime) }}</span>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="250" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button v-if="row.level < 3" type="primary" link size="large" @click="handleAddSubCategory(row)">
                  <el-icon>
                    <Plus />
                  </el-icon>添加子类
                </el-button>

                <el-button type="primary" link size="large" @click="handleEditCategory(row)">
                  <el-icon>
                    <Edit />
                  </el-icon>编辑
                </el-button>

                <el-popconfirm title="确定要删除这个分类吗？" confirm-button-text="确定" cancel-button-text="取消"
                  @confirm="handleDeleteCategory(row)">
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

        <!-- 空状态 -->
        <div v-if="!loading && categoryList.length === 0" class="empty-state">
          <el-empty description="暂无分类数据" :image-size="160" />
        </div>
      </div>
    </div>

    <!-- 添加/编辑分类对话框 -->
    <category-dialog ref="categorydialogRef" :mode="dialogMode" :parent-category="parentCategory"
      @success="handleDialogSuccess" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryDialog from './CategoryDialog.vue'
import { formatDate } from '@/utils/common'

import {
  getCategoryList,
  updateCategory,
  deleteCategory
} from '@/api/modules/category'

// 数据
const loading = ref(false)
const categoryList = ref([])
const categorydialogRef = ref(null)

const ddd = ref(0)

const dialogMode = ref('add')
const parentCategory = ref({})

// 筛选表单
const filterForm = reactive({
  categoryName: '',
  status: ''
})


/*
// 计算属性
const filteredCategoryList = computed(() => {
  let list = [...categoryList.value]

  if (filterForm.categoryName) {
    const keyword = filterForm.categoryName.toLowerCase()
    list = list.filter(item =>
      item.CategoryName.toLowerCase().includes(keyword)
    )
  }

  if (filterForm.status !== '') {
    list = list.filter(item => item.Status == filterForm.status)
  }

  return list
})
*/
// 方法
const fetchCategoryList = async () => {
  try {
    loading.value = true

    let params = { appType: 1, categoryName: filterForm.categoryName, status: filterForm.status }
    const res = await getCategoryList(params)
    // categoryList.value = buildCategoryTree(res.result || [])
    //服务端返回的数据为Tree格式
    categoryList.value = res.result
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}
/*
// 构建分类树
const buildCategoryTree = (list) => {
  const categoryMap = {}
  const tree = []

  // 建立映射
  list.forEach(item => {
    categoryMap[item.categoryId] = { ...item, children: [] }
  })

  // 构建树结构
  list.forEach(item => {
    const category = categoryMap[item.categoryId]
    if (item.parentId === 0) {
      tree.push(category)
    } else if (categoryMap[item.parentId]) {
      categoryMap[item.parentId].children.push(category)
    }
  })

  return tree
}
  */

// 搜索
const handleSearch = () => {
  fetchCategoryList()
}

// 重置
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  fetchCategoryList()
}

// 添加分类
const handleAddCategory = () => {
  dialogMode.value = 'add'
  let category = {
    categoryId: 0,
    categoryName: '',
    parentId: 0,
    level: 1,
    sortOrder: 0,
    status: 1,
    icon: '',
    appType: 1
  }
  parentCategory.value = {}
  categorydialogRef.value.openDialog(category)

}

// 添加子分类
const handleAddSubCategory = (parent) => {
  if (parent.level >= 3) {
    ElMessage.warning('最多只能添加三级分类')
    return
  }

  dialogMode.value = 'add'
  let category = {
    categoryId: 0,
    categoryName: '',
    parentId: parent.categoryId,
    level: parent.level + 1,
    sortOrder: 0,
    status: 1,
    icon: '',
    appType: 1
  }
  parentCategory.value = parent
  categorydialogRef.value.openDialog(category)
}

// 编辑分类
const handleEditCategory = (category) => {
  dialogMode.value = 'edit'
  if (category.parentId === 0)
    parentCategory.value = {}
  else
    parentCategory.value = categoryList.value.find(it => it.categoryId == category.parentId)

  categorydialogRef.value.openDialog(category)
}

// 删除分类
const handleDeleteCategory = async (category) => {
  try {
    if (category.children && category.children.length > 0) {
      ElMessage.error('请先删除子分类')
      return
    }

    await ElMessageBox.confirm(
      `确定要删除分类"${category.categoryName}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteCategory(category.categoryId)

    //查询父节点下的子节点
    if (parentCategory.value.categoryId) {
      let index = parentCategory.value.children.findIndex(it => it.categoryId === category.categoryId)
      parentCategory.value.children.splice(index, 1)
    }
    else {
      let index = categoryList.value.findIndex(it => it.categoryId == category.categoryId)
      categoryList.value.splice(index, 1)
    }



    ElMessage.success('删除成功')


  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 修改排序
const handleSortChange = async (category) => {
  try {
    let data = { categoryId: category.categoryId, sortOrder: category.sortOrder }
    await updateCategory(data)
    ElMessage.success('排序更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
  }
}



// 修改状态
const handleStatusChange = async (category) => {
  try {
    let data = { categoryId: category.categoryId, status: category.status }
    await updateCategory(data)
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
    category.status = category.status === 1 ? 0 : 1
  }
}

// 对话框成功回调
const handleDialogSuccess = (res) => {
  //查询父节点下的子节点
  if (parentCategory.value.categoryId) {
    let row = parentCategory.value.children.find(it => it.categoryId === res.categoryId)
    if (row) {
      row.categoryName = res.categoryName;
      row.icon = res.icon;
      row.sortOrder = res.sortOrder;
      row.level = res.level;
      row.status = res.status;
    }
    else {
      parentCategory.value.children.splice(0, 0, res);
    }
  }
  else {
    let row = categoryList.value.find(it => it.categoryId === res.categoryId)
    if (row) {
      row.categoryName = res.categoryName;
      row.icon = res.icon;
      row.sortOrder = res.sortOrder;
      row.level = res.level;
      row.status = res.status;
    }
    else {
      categoryList.value.splice(0, 0, res);
    }
  }
}

// 刷新列表
const refreshList = () => {
  fetchCategoryList()
}

// 生命周期
onMounted(() => {
  fetchCategoryList()
})
</script>

<style lang="scss" scoped>
.category-management {
  padding: 20px;

  .category-container {
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

    .category-name {
      display: flex;
      align-items: center;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .empty-state {
      padding: 60px 0;
      text-align: center;
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
          }

          &:hover {
            td {
              background-color: #f5f7fa;
            }
          }

          &:last-child {
            td {
              border-bottom: none;
            }
          }
        }
      }
    }

    :deep(.el-empty) {
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