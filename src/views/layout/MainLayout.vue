<template>
  <div class="layout-container">
    <!-- 左侧菜单栏 -->
    <Sidebar :collapse="isCollapse" />
    
    <!-- 右侧主内容区 -->
    <div class="main-content" :class="{ 'collapsed': isCollapse }">
      <!-- 顶部导航栏 -->
      <Header @toggle-collapse="toggleCollapse" />
      
      <!-- 内容区域 -->
      <div class="content-wrapper">
        <!-- 面包屑导航 -->
        <!-- <Breadcrumb /> -->
        
        <!-- 页面内容 -->
        <div class="page-content">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'

const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    min-width: 0; /* 防止内容溢出 */
    
    &.collapsed {
      margin-left: 0;
    }
  }
  
  .content-wrapper {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #f0f2f5;
    height: calc(100vh - 60px);
    
    .page-content {
      margin-top: 20px;
      padding: 20px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
}

// 页面切换动画
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

// 全局滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
  
  &:hover {
    background: #a8a8a8;
  }
}
</style>