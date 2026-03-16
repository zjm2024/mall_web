import request from '@/utils/request'
import { API_PATHS } from '../../constants/api'
// 商户管理 API
const shopApi = {
    // 获取商户列表SHOP
    getShopPageList(params) {
        return request.post(API_PATHS.SHOP.LIST, { params: params })

    },
    // 创建商户
    createShop(data) {
        return request.post(API_PATHS.SHOP.UPDATE, { data: data })
    },

    // 更新商户Shop
    updateShop(data) {
        return request.post(API_PATHS.SHOP.UPDATE, { data: data });
    },

    // 删除Shop
    deleteShop(id) {
        return request.get(API_PATHS.SHOP.DETAIL(id));
    },


}


export const {
    getShopPageList,
    createShop,
    updateShop,
    deleteShop,


} = shopApi

export default shopApi