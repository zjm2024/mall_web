import request from '@/utils/request'
import { API_PATHS } from '../../constants/api'
// 用户管理 API
const userApi = {
    // 获取用户列表USER
    getUserPageList(params) {
        return request.post(API_PATHS.USER.LIST, { params: params })

    },
    // 创建用户
    createUser(data) {
        return request.post(API_PATHS.USER.UPDATE, { data: data })
    },

    // 更新用户User
    updateUser(data) {
        return request.post(API_PATHS.USER.UPDATE, { data: data });
    },

    // 删除User
    deleteUser(id) {
        return request.get(API_PATHS.USER.DETAIL(id));
    },
    // 重置用户密码
    resetUserPassword(data) {
        return request.post(API_PATHS.USER.RESETUSERPASSWORD, { data: data });
    },

    // 修改用户密码
    changeUserPassword(data) {
        return request.post(API_PATHS.USER.CHANGEUSERPASSWORD, { data: data });
    },
}


export const {
    getUserPageList,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    changeUserPassword

} = userApi

export default userApi