<template>
  <div class="base-info">
    <!-- 店铺信息 + 管理中心 -->
    <div class="header-section">
      <!-- 左侧店铺信息 -->
      <el-card class="shop-card" shadow="never">
        <template #header>
          <div class="card-header">
            <h3 class="shop-name">{{ shopInfo.name }}</h3>
            <el-tag :type="shopInfo.statusType" class="shop-status">{{ shopInfo.status }}</el-tag>
          </div>
        </template>

        <div class="shop-info">
          <div
            v-for="(item, index) in formattedShopDetails"
            :key="index"
            class="info-item"
          >
            <span class="label">{{ item.label }}</span>
            <component
              :is="item.link ? 'a' : 'span'"
              :class="{ link: item.link }"
              :href="item.link || null"
              target="_blank"
              v-if="item.link"
            >
              {{ item.value }}
            </component>
            <el-tag v-else-if="item.tag" :type="item.tagType" class="cert-status">{{ item.value }}</el-tag>
            <span v-else class="value">{{ item.value }}</span>
          </div>
        </div>
      </el-card>

      <!-- 右侧管理中心 -->
      <el-card class="management-center" shadow="never">
        <template #header>
          <div class="center-header">
            <el-icon :size="24" color="#409EFF"><Management /></el-icon>
            <span class="title">管理中心</span>
          </div>
        </template>

        <div class="config-items">
          <ConfigItem
            v-for="(config, index) in managementConfigs"
            :key="index"
            :config="config"
            @click="handleConfigClick"
          />
        </div>
      </el-card>
    </div>

    <!-- 配置管理弹窗 -->
    <ConfigModal
      v-model="showConfigModal"
      :config-key="currentConfigKey"
      @refresh="handleConfigRefresh"
    />

    <!-- 账户信息区域 -->
    <el-card class="apps-section" shadow="never">
      <template #header>
        <div class="section-title">
          <el-icon :size="20" color="#409EFF"><Wallet /></el-icon>
          <span>账户信息</span>
          <el-button
            class="balance-toggle-btn"
            @click="toggleBalanceVisibility"
            type="primary"
            link
          >
            <el-icon :size="16">
              <component :is="isBalanceVisible ? Hide : View" />
            </el-icon>
            {{ isBalanceVisible ? '隐藏金额' : '显示金额' }}
          </el-button>
        </div>
      </template>

      <div class="apps-grid">
        <!-- 账户卡片循环渲染 -->
        <AccountCard
          v-for="(account, index) in accounts"
          :key="index"
          :account="account"
          :is-balance-visible="isBalanceVisible"
          :actions="accountActions"
          @action="(action) => handleAccountAction(action, account)"
        />

        <!-- 新增账户按钮 -->
        <AccountCard
          :is-add-card="true"
          @click="handleAddAccount"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {
  Management,
  Wallet,
  View,
  Hide
} from '@element-plus/icons-vue'

// 导入 composable
import { useShop } from '@/composables/useShop'

// 导入通用组件
import ConfigItem from '@/components/common/ConfigItem.vue'
import AccountCard from '@/components/common/AccountCard.vue'
import ConfigModal from '@/components/common/ConfigModal.vue'

// ==================== 使用 Composable ====================
const {
  // 状态
  shopInfo,
  accounts,
  isBalanceVisible,

  // 配置弹窗状态
  showConfigModal,
  currentConfigKey,

  // 配置
  managementConfigs,
  accountActions,
  formattedShopDetails,

  // 方法
  toggleBalanceVisibility,
  handleConfigClick,
  handleConfigModalClose,
  handleConfigRefresh,
  handleAccountAction,
  handleAddAccount
} = useShop()
</script>

<style scoped lang="scss">
.base-info {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 84px);

  :deep(.el-card) {
    border: none;
    border-radius: 8px;

    .el-card__header {
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
    }

    .el-card__body {
      padding: 20px;
    }
  }

  // 头部区域
  .header-section {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    .shop-card {
      flex: 0 0 380px;

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .shop-name {
          margin: 0;
          font-size: 18px;
          font-weight: 500;
          color: #303133;
        }

        .shop-status {
          padding: 2px 12px;
        }
      }

      .shop-info {
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;

          .label {
            color: #606266;
            min-width: 80px;
          }

          .value {
            color: #303133;
            font-weight: 500;
          }

          .link {
            color: #409EFF;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }

          .cert-status {
            padding: 2px 12px;
          }
        }
      }
    }

    .management-center {
      flex: 1;

      .center-header {
        display: flex;
        align-items: center;
        gap: 12px;

        .title {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
        }
      }

      .config-items {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        @media (max-width: 1400px) {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }
  }

  // 账户信息区域
  .apps-section {
    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #303133;

      .balance-toggle-btn {
        margin-left: auto;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 4px;

        &:hover {
          color: #409EFF;
        }
      }
    }

    .apps-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;

      @media (max-width: 1600px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}

// 响应式设计
@media (max-width: 1600px) {
  .base-info {
    .header-section {
      flex-direction: column;

      .shop-card {
        flex: 1;
      }

      .management-center {
        .config-items {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    }

    .apps-section {
      .apps-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }
}

@media (max-width: 1200px) {
  .base-info {
    .apps-section {
      .apps-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>
