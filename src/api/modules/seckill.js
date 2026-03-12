import request from '@/utils/request'
import { API_PATHS } from '../../constants/api'
// 用户管理 API
const seckillApi = {
    // 获取秒杀列表
    getSeckillPageList(params) {
        return request.post(API_PATHS.SECKILL.LIST, { params: params })

    },
    // 创建秒杀
    createSeckill(data) {
        return request.post(API_PATHS.SECKILL.UPDATE, { data: data })
    },

    // 更新秒杀
    updateSeckill(data) {
        return request.post(API_PATHS.SECKILL.UPDATE, { data: data });
    },

    //获取秒杀时间点
    getSeckillTimeOptions(appType) {
        return request.get(API_PATHS.SECKILL.TIMEOPTIONS(appType))
    },
}


export const {
    getSeckillPageList,
    createSeckill,
    updateSeckill,
    getSeckillTimeOptions
} = seckillApi

export default seckillApi