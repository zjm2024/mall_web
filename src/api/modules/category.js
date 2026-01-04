import  request  from '@/utils/request'

// 分类管理 API
const categoryApi = {
  // 获取分类列表
  getCategoryList(params) {
    return request.get('/api/categories', { params })
  },
  
  // 获取分类详情
  getCategoryDetail(id) {
    return request.get(`/api/categories/${id}`)
  },
  
  // 创建分类
  createCategory(data) {
    return request.post('/api/categories', data)
  },
  
  // 更新分类
  updateCategory(id, data) {
    return request.put(`/api/categories/${id}`, data)
  },
  
  // 删除分类
  deleteCategory(id) {
    return request.delete(`/api/categories/${id}`)
  },
  
  // 批量更新排序
  batchUpdateSort(data) {
    return request.put('/api/categories/batch-sort', data)
  }
}

export const {
  getCategoryList,
  getCategoryDetail,
  createCategory,
  updateCategory,
  deleteCategory,
  batchUpdateSort
} = categoryApi

export default categoryApi