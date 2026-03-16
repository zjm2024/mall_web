<template>
  <div :class="['account-card', { 'add-card': isAddCard }]" @click="handleClick">
    <!-- 新增账户卡片 -->
    <template v-if="isAddCard">
      <el-icon :size="48" color="#C0C4CC"><Plus /></el-icon>
      <div class="add-label">{{ addLabel }}</div>
    </template>

    <!-- 账户信息卡片 -->
    <template v-else>
      <div class="account-header">
        <i :class="account.iconClass" class="account-icon" :style="{ color: account.iconColor }"></i>
        <span class="account-name">{{ account.name }}</span>
      </div>
      <div class="account-info">
        <div class="info-line">ID: {{ account.id }}</div>
      </div>
      <div class="balance-display" :class="{ hidden: !isBalanceVisible }">
        {{ isBalanceVisible ? formatBalance(account.balance) : hideSymbol }}
      </div>
      <div class="account-footer">
        <el-tag :type="account.statusType" class="status-tag">{{ account.status }}</el-tag>
        <div class="action-icons">
          <el-icon
            v-for="(action, index) in actions"
            :key="index"
            class="icon-btn"
            :title="action.title"
            @click.stop="handleAction(action)"
          >
            <component :is="action.icon" />
          </el-icon>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { Edit, List, MoreFilled, Plus } from '@element-plus/icons-vue'
import { BALANCE_FORMAT_OPTIONS } from '@/constants/shop'

defineProps({
  // 账户数据
  account: {
    type: Object,
    default: () => ({})
  },
  // 是否为新增卡片
  isAddCard: {
    type: Boolean,
    default: false
  },
  // 新增卡片标签
  addLabel: {
    type: String,
    default: '新增账户'
  },
  // 金额是否可见
  isBalanceVisible: {
    type: Boolean,
    default: true
  },
  // 隐藏符号
  hideSymbol: {
    type: String,
    default: BALANCE_FORMAT_OPTIONS.hideSymbol
  },
  // 操作配置
  actions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['click', 'action'])

/**
 * 格式化余额显示
 * @param {number} balance - 余额数值
 * @returns {string} 格式化后的余额字符串
 */
const formatBalance = (balance) => {
  const { currency, decimalPlaces } = BALANCE_FORMAT_OPTIONS
  return `${currency} ${balance.toFixed(decimalPlaces)}`
}

/**
 * 处理卡片点击
 */
const handleClick = () => {
  if (!isAddCard) return
  emit('click')
}

/**
 * 处理操作按钮点击
 * @param {Object} action - 操作对象
 */
const handleAction = (action) => {
  emit('action', action)
}
</script>

<style scoped lang="scss">
.account-card {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  min-height: 200px;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &.add-card {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1px dashed #D9D9D9;
    background: #FAFAFA;

    &:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border-color: #409EFF;
      background: #F5F7FA;

      .add-label {
        color: #409EFF;
      }
    }

    .add-label {
      font-size: 14px;
      color: #909399;
      transition: all 0.3s;
    }
  }

  .account-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .account-icon {
      font-size: 24px;
    }

    .account-name {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }

  .account-info {
    flex: 1;
    margin-bottom: 16px;

    .info-line {
      font-size: 12px;
      color: #909399;
    }
  }

  .balance-display {
    font-weight: bold;
    font-size: 20px;
    margin: 10px 0;
    color: #303133;
    font-family: 'Arial', sans-serif;

    &.hidden {
      color: #C0C4CC;
      letter-spacing: 2px;
    }
  }

  .account-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status-tag {
      padding: 2px 12px;
      font-size: 12px;
    }

    .action-icons {
      display: flex;
      gap: 12px;

      .icon-btn {
        cursor: pointer;
        color: #606266;
        transition: all 0.3s;

        &:hover {
          color: #409EFF;
          transform: scale(1.2);
        }
      }
    }
  }
}
</style>
