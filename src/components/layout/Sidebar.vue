<!-- src/components/layout/Sidebar.vue -->
<template>
  <div class="sidebar-container" :class="{ 'collapsed': collapse }">
    <!-- Logo区域 -->
    <div class="logo">
      <div class="logo-container">
        <el-icon :size="32" color="#1890ff" v-if="collapse">
          <Shop />
        </el-icon>
        <img v-else src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="Logo" class="logo-img" />
        <span class="logo-text" v-if="!collapse">微信小店</span>
      </div>
    </div>
    
    <!-- 菜单区域 -->
    <div class="menu-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapse"
        :collapse-transition="false"
        :unique-opened="true"
        background-color="#001529"
        text-color="#b7bdc3"
        active-text-color="#1890ff"
        router
      >
        <template v-for="item in menuList" :key="item.path || item.title">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.title">
            <template #title>
              <el-icon v-if="item.icon">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- 无子菜单 -->
          <el-menu-item v-else :index="item.path">
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <template #title>
              <span>{{ item.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    
    <!-- 用户信息（折叠时不显示） -->
    <div class="user-info" v-if="!collapse && userInfo.AdminId">
      <div class="user-avatar">
        <el-avatar :size="36" :src="userInfo.Avatar">
          {{ userInfo.RealName?.charAt(0) || userInfo.Username?.charAt(0) }}
        </el-avatar>
      </div>
      <div class="user-details">
        <div class="user-name">{{ userInfo.RealName || userInfo.Username }}</div>
        <div class="user-role">
          <el-tag :type="isSuperAdmin ? 'danger' : 'primary'" size="small">
            {{ isSuperAdmin ? '超管' : '商户' }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { Shop } from '@element-plus/icons-vue'
import { getMenuByUser } from '@/constants/menu'  // 导入新的函数

const props = defineProps({
  collapse: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const userStore = useUserStore()

// 使用 storeToRefs 保持响应式
const { 
  userInfo, 
  isSuperAdmin,
  sidebarCollapse 
} = storeToRefs(userStore)

// 根据用户权限动态获取菜单
const menuList = computed(() => {
  return getMenuByUser(isSuperAdmin.value)
})

// 当前激活的菜单
const activeMenu = computed(() => {
  const { path } = route
  // 寻找匹配的菜单项
  for (const item of menuList.value) {
    if (item.path === path) return item.path
    if (item.children) {
      const child = item.children.find(child => child.path === path)
      if (child) return child.path
    }
  }
  return ''
})
</script>

<style lang="scss" scoped>
.sidebar-container {
  width: 220px;
  height: 100%;
  background-color: #001529;
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  &.collapsed {
    width: 64px;
    
    .logo-text {
      display: none;
    }
    
    .logo-img {
      margin: 0;
    }
  }
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #002140;
    border-bottom: 1px solid #001529;
    flex-shrink: 0;
    
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      width: 100%;
      
      .logo-img {
        width: 32px;
        height: 32px;
        border-radius: 4px;
      }
      
      .logo-text {
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        white-space: nowrap;
        transition: opacity 0.3s;
      }
    }
  }
  
  .menu-wrapper {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }
  }
  
  .el-menu {
    border-right: none;
    width: 100%;
    
    // 隐藏滚动条
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    
    // 修复子菜单选中状态
    :deep(.el-sub-menu) {
      &.is-active {
        .el-sub-menu__title {
          color: #1890ff !important;
          background-color: #000c17 !important;
          
          .el-icon {
            color: #1890ff !important;
          }
        }
      }
      
      .el-sub-menu__title {
        &:hover {
          background-color: #000c17 !important;
        }
        
        .el-icon {
          color: #b7bdc3;
        }
      }
    }
    
    // 修复菜单项选中状态
    :deep(.el-menu-item) {
      height: 48px;
      line-height: 48px;
      
      &:hover {
        background-color: #000c17 !important;
      }
      
      &.is-active {
        color: #1890ff !important;
        background-color: #000c17 !important;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: #1890ff;
        }
      }
    }
  }
  
  .user-info {
    padding: 16px;
    background-color: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    
    .user-avatar {
      flex-shrink: 0;
    }
    
    .user-details {
      flex: 1;
      overflow: hidden;
      
      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .user-role {
        :deep(.el-tag) {
          height: 20px;
          line-height: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>