<template>
  <div class="header-container">
    <!-- 左侧：菜单折叠按钮 -->
    <div class="header-left">
      <el-button class="collapse-btn" type="text" @click="$emit('toggle-collapse')">
        <el-icon :size="20">
          <component :is="collapseIcon" />
        </el-icon>
      </el-button>

      <!-- 面包屑导航 -->
      <Breadcrumb />
    </div>

    <!-- 右侧：用户信息和操作 -->
    <div class="header-right">
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input v-model="searchKeyword" placeholder="搜索菜单、功能..." clearable @keyup.enter="handleSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>

      <!-- 通知 -->
      <div class="notification">
        <el-badge :value="3" class="badge-item">
          <el-button type="text" @click="handleNotification">
            <el-icon :size="20">
              <Bell />
            </el-icon>
          </el-button>
        </el-badge>
      </div>

      <!-- 用户信息 -->
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="user-name">管理员</span>
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon>
                <User />
              </el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon>
                <Setting />
              </el-icon>系统设置
            </el-dropdown-item>
            <el-dropdown-item command="changepassword">
              <el-icon>
                <Compass />
              </el-icon>修改密码
            </el-dropdown-item>

            <el-dropdown-item divided command="logout">
              <el-icon>
                <SwitchButton />
              </el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!-- 修改密码对话框 -->
  <userModPassword-dialog ref="usermodpassworddialogRef" :mode="resetdialogMode" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Fold, Expand, Search, Bell, User, Setting, SwitchButton, ArrowDown, Compass
} from '@element-plus/icons-vue'
import Breadcrumb from './Breadcrumb.vue'
import UserModPasswordDialog from '../../views/shop/user/UserModPasswordDialog.vue'
import { useUserStore } from '@/stores/user'


const props = defineProps({
  collapse: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-collapse'])

const router = useRouter()

const usermodpassworddialogRef = ref(null)
const resetdialogMode = ref('add')

const searchKeyword = ref('')
const userStore = useUserStore()

const collapseIcon = computed(() => {
  return props.collapse ? Expand : Fold
})

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    console.log('搜索:', searchKeyword.value)
  }
}

const handleNotification = () => {
  console.log('打开通知中心')
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'changepassword':
      const user = { userNo: userStore.userInfo.userNo }
      resetdialogMode.value = 'change'
      usermodpassworddialogRef.value.openDialog(user)
      break


    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = () => {
  console.log('退出登录')
  userStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.header-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    flex: 1;

    .collapse-btn {
      margin-right: 20px;
      font-size: 20px;
      color: #5a5e66;

      &:hover {
        color: #1890ff;
        background-color: transparent;
      }
    }

    :deep(.breadcrumb-container) {
      padding: 0;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .search-box {
      width: 240px;

      :deep(.el-input__wrapper) {
        border-radius: 20px;
      }
    }

    .notification {
      .badge-item {
        :deep(.el-badge__content) {
          top: 8px;
          right: 8px;
        }
      }

      .el-button {
        color: #5a5e66;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;

      &:hover {
        background-color: #f5f7fa;
      }

      .user-name {
        margin: 0 8px;
        font-size: 14px;
        color: #303133;
      }

      .el-icon {
        color: #c0c4cc;
      }
    }
  }
}
</style>