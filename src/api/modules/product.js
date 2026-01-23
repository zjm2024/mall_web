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

  // 创建商品
  createProduct(data) {
    return request.post(API_PATHS.PRODUCT.UPDATE, { data: data })
  },

  // 更新商品
  updateProduct(data, delids) {
    return request.post(API_PATHS.PRODUCT.UPDATE, { data: data, delSpecsids: delids })
  },

  // 获取商品详情
  getProductDetail(id) {
    return request.get(API_PATHS.PRODUCT.DETAIL(id))
  },


  // 删除商品
  deleteProduct(id) {
    return request.get(API_PATHS.PRODUCT.DELETE(id))
  },

  // 批量删除商品
  deleteBatchProducts(ids) {
    return request.get(API_PATHS.PRODUCT.DELETEBATCH(ids))
  },

  // 删除规格
  deleteProductSpecs(id) {
    return request.get(API_PATHS.PRODUCT.DELETESPECS(id))
  },
  // 批量删除规格
  deleteBatchProductSpecs(ids) {
    return request.get(API_PATHS.PRODUCT.DELETEBATCHSPECS(ids))
  },

  // 上传商品图片
  async uploadProductImage(data) {
    return await request.post(API_PATHS.UPLOAD.UPLOADIMAGE, data)
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
  deleteBatchProducts,


  getCategoryOptions,
  getSpecList,
  saveSpecs,
  updateSpec,
  deleteProductSpecs,
  deleteBatchProductSpecs,
  uploadProductImage,
  batchOperation
} = productApi

export default productApi