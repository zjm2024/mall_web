import request from '@/utils/request'
import { API_PATHS } from '../../constants/api'
// 商品管理 API
const productApi = {
  // 获取商品列表
  getProductPageList(params) {
    return request.post(API_PATHS.PRODUCT.LIST, { params: params })

  },

  // 获取分类列表（用于下拉选择）
  getCategoryOptions(params) {
    return request.get(API_PATHS.PRODUCT.CATEGORIESOPTIONS, { params: params })
  },

  // 获取商品详情
  getProductDetail(id) {
    return request.get(`/api/products/${id}`)
  },

  // 创建商品
  createProduct(data) {
    return request.post('/api/products', data)
  },

  // 更新商品
  updateProduct(id, data) {
    return request.put(`/api/products/${id}`, data)
  },

  // 删除商品
  deleteProduct(id) {
    return request.delete(`/api/products/${id}`)
  },

  // 批量删除商品
  batchDeleteProducts(data) {
    return request.post('/api/products/batch-delete', data)
  },

  // 批量更新商品状态
  batchUpdateStatus(data) {
    return request.put('/api/products/batch-status', data)
  },



  // 获取规格列表
  getSpecList(productId) {
    return request.get(`/api/products/${productId}/specs`)
  },

  // 保存规格
  saveSpecs(productId, data) {
    return request.post(`/api/products/${productId}/specs`, data)
  },

  // 更新规格
  updateSpec(specId, data) {
    return request.put(`/api/specs/${specId}`, data)
  },

  // 删除规格
  deleteSpec(specId) {
    return request.delete(`/api/specs/${specId}`)
  },

  // 上传商品图片
  uploadProductImage(data) {
    return request.post('/api/upload/product-image', data)
  },

  // 批量操作（上架/下架/删除）
  batchOperation(data) {
    return request.post('/api/products/batch-operation', data)
  }
}

export const {
  getProductPageList,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
  batchUpdateStatus,
  getCategoryOptions,
  getSpecList,
  saveSpecs,
  updateSpec,
  deleteSpec,
  uploadProductImage,
  batchOperation
} = productApi

export default productApi