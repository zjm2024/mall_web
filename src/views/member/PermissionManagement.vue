<!-- src/views/shop/member/PermissionView.vue -->
<template>
  <div class="permission-view">
    <div class="page-header">
      <h1 class="page-title">权限说明</h1>
    </div>

    <div class="permission-container">
      <!-- 超级管理员权限 -->
      <el-card class="permission-card">
        <template #header>
          <div class="card-header">
            <el-icon><Star /></el-icon>
            <h3 class="card-title">超级管理员权限</h3>
            <el-tag type="danger" size="small">全部权限</el-tag>
          </div>
        </template>
        <div class="permission-content">
          <p>拥有系统所有功能权限，可以访问和管理所有模块。</p>
          <ul class="permission-list">
            <li>所有菜单访问权限</li>
            <li>所有操作权限（增删改查）</li>
            <li>系统设置权限</li>
            <li>数据管理权限</li>
          </ul>
        </div>
      </el-card>

      <!-- 商户管理员权限 -->
      <el-card class="permission-card">
        <template #header>
          <div class="card-header">
            <el-icon><Shop /></el-icon>
            <h3 class="card-title">商户管理员权限</h3>
            <el-tag type="primary" size="small">基础权限</el-tag>
          </div>
        </template>
        <div class="permission-content">
          <p>拥有商户基础管理权限，可以管理自己的店铺和商品。</p>
          
          <div class="permission-groups">
            <div class="permission-group" v-for="(group, key) in permissionGroups" :key="key">
              <h4 class="group-title">{{ group.name }}</h4>
              <div class="group-permissions">
                <el-tag 
                  v-for="permission in group.permissions" 
                  :key="permission"
                  size="small"
                  class="permission-tag"
                >
                  {{ getPermissionLabel(permission) }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 当前账号权限状态 -->
      <el-card class="current-permission-card">
        <template #header>
          <div class="card-header">
            <el-icon><User /></el-icon>
            <h3 class="card-title">当前账号权限</h3>
          </div>
        </template>
        <div class="current-permission-content">
          <div class="user-info">
            <el-avatar :size="60" :src="userInfo.Avatar" />
            <div class="user-details">
              <h4>{{ userInfo.RealName || userInfo.Username }}</h4>
              <p>{{ userInfo.Email }}</p>
              <p>{{ userInfo.Phone }}</p>
            </div>
            <div class="user-status">
              <el-tag :type="isSuperAdmin ? 'danger' : 'primary'" size="large">
                {{ isSuperAdmin ? '超级管理员' : '商户管理员' }}
              </el-tag>
              <p class="status-tip">
                {{ isSuperAdmin ? '拥有全部系统权限' : '拥有商户基础管理权限' }}
              </p>
            </div>
          </div>
          
          <div class="last-login">
            <p>最后登录时间：{{ formatTime(userInfo.LastLoginTime) }}</p>
            <p>登录次数：{{ userInfo.LoginCount || 0 }} 次</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Star, Shop, User } from '@element-plus/icons-vue'
import { permissionGroups } from '@/config/permission'

const store = useStore()

const userInfo = computed(() => store.state.user.userInfo)
const isSuperAdmin = computed(() => store.getters['user/isSuperAdmin'])

// 权限标签映射
const permissionLabels = {
  'dashboard.view': '查看仪表盘',
  'shop.base.manage': '管理店铺基础信息',
  'shop.home.manage': '管理店铺主页',
  'shop.category.manage': '管理商品分类',
  'shop.member.manage': '管理店铺成员',
  'product.list.view': '查看商品列表',
  'product.create': '添加商品',
  'product.update': '编辑商品',
  'product.delete': '删除商品',
  'order.list.view': '查看订单列表',
  'afterSale.list.view': '查看售后列表',
  'settlement.list.view': '查看结算列表'
}

const getPermissionLabel = (permission) => {
  return permissionLabels[permission] || permission
}

const formatTime = (time) => {
  if (!time) return '-'
  return new Date(time).toLocaleString()
}
</script>

<style lang="scss" scoped>
.permission-view {
  padding: 20px;
  
  .page-header {
    margin-bottom: 24px;
    
    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }
  }
  
  .permission-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .permission-card, .current-permission-card {
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .el-icon {
        font-size: 20px;
        color: #409eff;
      }
      
      .card-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }
  }
  
  .permission-content {
    p {
      margin: 0 0 16px 0;
      color: #606266;
      line-height: 1.6;
    }
    
    .permission-list {
      margin: 0;
      padding-left: 20px;
      color: #606266;
      
      li {
        margin-bottom: 8px;
      }
    }
    
    .permission-groups {
      .permission-group {
        margin-bottom: 20px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .group-title {
          margin: 0 0 12px 0;
          font-size: 15px;
          font-weight: 600;
          color: #303133;
        }
        
        .group-permissions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          
          .permission-tag {
            background: #e6f4ff;
            border-color: #91caff;
            color: #1677ff;
          }
        }
      }
    }
  }
  
  .current-permission-content {
    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e4e7ed;
      
      .user-details {
        flex: 1;
        
        h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #303133;
        }
        
        p {
          margin: 4px 0;
          color: #606266;
          font-size: 14px;
        }
      }
      
      .user-status {
        text-align: center;
        
        .status-tip {
          margin: 8px 0 0 0;
          font-size: 12px;
          color: #909399;
        }
      }
    }
    
    .last-login {
      margin-top: 20px;
      
      p {
        margin: 8px 0;
        color: #606266;
        font-size: 14px;
      }
    }
  }
}
</style>