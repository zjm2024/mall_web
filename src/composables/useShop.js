import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  MANAGEMENT_CONFIGS,
  ACCOUNT_ACTIONS,
  ACCOUNT_TYPES,
  SHOP_DETAIL_FIELDS
} from '@/constants/shop'

/**
 * 店铺信息管理 Composable
 * @returns {Object} 店铺管理相关的方法和状态
 */
export function useShop() {
  // 获取用户信息 store
  const userStore = useUserStore()

  /** 
  *  测试数据，示例店铺信息
  * 
  * ===开始===
  */

  // 店铺信息
  /**
   * 通过userStore.userInfo 获取字段信息
   */
  const shopInfo = computed(() => {
    const userInfo = userStore.userInfo
    // 普通商户用户显示
    if (userStore.isSuperAdmin != 1) {
      return {
        name: userInfo?.userName || '未有用户名', // 用字段：userName
        status: userInfo?.appType === 0 ? '启用' : '未启用', // 用字段：appType，1-未启用，0-启用
        statusType: userInfo?.appType === 0 ? 'success' : 'info', // 参考上面，0-success，1-error
        details: {
          code: userInfo?.businessNo || '--', // 商户编号
          agent: { value: '【测试数据】你的商户管理员', link: '#' }, // 这里是显示商户主号（商户管理员），若是商户管理员用户自己，则显示其主号，日后有接口再实现
          provider: { value: userInfo?.businessName || '--', link: '#' }, // 商户名字
          certStatus: { value: '认证成功', tag: true, tagType: 'success' } // 不动，日后有接口再实现
        }
      }
    }else{
      // 超级管理员显示这个
      return{
        name: userInfo?.userName || '未起名超级管理员', // 用字段：userName
        status: userInfo?.appType === 0 ? '启用' : '未启用', // 用字段：appType，1-未启用，0-启用
        statusType: userInfo?.appType === 0 ? 'success' : 'info', // 参考上面，0-success，1-error
        details: {
          code:  '⭐⭐⭐⭐⭐', // 五星高级权限
          agent: { value: '乐聊名片', link: '#' }, // 代理：乐聊名片
          provider: { value: '广州华顺青为信息科技有限责任公司', link: '#' }, // 服务商：公司名
          certStatus: { value: '认证成功', tag: true, tagType: 'success' } // 不动
        }
      }
    }
  })

  // 账户列表
  const accounts = ref([
    {
      name: ACCOUNT_TYPES.PAID_INCOME.name,
      id: 'A051933028985957',
      balance: 0.00,
      status: '启用',
      statusType: ACCOUNT_TYPES.PAID_INCOME.statusType,
      iconClass: ACCOUNT_TYPES.PAID_INCOME.iconClass,
      iconColor: ACCOUNT_TYPES.PAID_INCOME.iconColor
    },
    {
      name: ACCOUNT_TYPES.UNUSED_RECHARGE.name,
      id: 'A679509717603696964',
      balance: 0.00,
      status: '启用',
      statusType: ACCOUNT_TYPES.UNUSED_RECHARGE.statusType,
      iconClass: ACCOUNT_TYPES.UNUSED_RECHARGE.iconClass,
      iconColor: ACCOUNT_TYPES.UNUSED_RECHARGE.iconColor
    },
    {
      name: ACCOUNT_TYPES.DEPOSIT.name,
      id: 'A658426774903569',
      balance: 0.00,
      status: '启用',
      statusType: ACCOUNT_TYPES.DEPOSIT.statusType,
      iconClass: ACCOUNT_TYPES.DEPOSIT.iconClass,
      iconColor: ACCOUNT_TYPES.DEPOSIT.iconColor
    }
  ])

   /** 
  * ===结束===
  */

  // 余额显示状态
  const isBalanceVisible = ref(false)

  /**
   * 格式化后的店铺详情列表
   */
  const formattedShopDetails = computed(() => {
    const details = shopInfo.value?.details
    if (!details) {
      return []
    }
    
    return SHOP_DETAIL_FIELDS.map(field => {
      const detail = details[field.key]
      return {
        label: field.label,
        value: typeof detail === 'object' ? detail.value : detail,
        type: field.type,
        link: detail?.link || null,
        tag: detail?.tag || false,
        tagType: detail?.tagType || ''
      }
    })
  })


  /**
   * 切换余额显示状态
   */
  const toggleBalanceVisibility = () => {
    isBalanceVisible.value = !isBalanceVisible.value
    ElMessage.success(isBalanceVisible.value ? '已显示余额' : '已隐藏余额')
  }

  /**
   * 处理配置项点击
   * @param {Object} config - 配置项对象
   */
  const handleConfigClick = (config) => {
    ElMessage.info(`点击配置: ${config.label}`)
    // TODO: 跳转到对应配置页面
    // router.push({ name: config.route })
  }

  /**
   * 处理账户操作
   * @param {Object} action - 操作对象
   * @param {Object} account - 账户对象
   */
  const handleAccountAction = (action, account) => {
    switch (action.action) {
      case 'edit':
        ElMessage.info(`编辑账户: ${account.name}`)
        // TODO: 打开编辑对话框
        break
      case 'remark':
        ElMessage.info(`备注账户: ${account.name}`)
        // TODO: 打开备注对话框
        break
      case 'more':
        ElMessage.info(`更多操作: ${account.name}`)
        // TODO: 显示更多操作菜单
        break
      default:
        ElMessage.info(`${action.title}: ${account.name}`)
    }
  }

  /**
   * 处理新增账户
   */
  const handleAddAccount = () => {
    ElMessage.info('打开新增账户对话框')
    // TODO: 打开新增账户对话框
  }

  /**
   * 刷新店铺信息
   */
  const refreshShopInfo = () => {
    // TODO: 调用 API 获取最新数据
    ElMessage.success('店铺信息已刷新')
  }

  /**
   * 更新账户余额
   * @param {string} accountId - 账户ID
   * @param {number} balance - 新余额
   */
  const updateAccountBalance = (accountId, balance) => {
    const account = accounts.value.find(acc => acc.id === accountId)
    if (account) {
      account.balance = balance
    }
  }

  /**
   * 获取账户信息
   * @param {string} accountId - 账户ID
   * @returns {Object|null} 账户对象
   */
  const getAccountById = (accountId) => {
    return accounts.value.find(acc => acc.id === accountId) || null
  }

  return {
    // 状态
    shopInfo,
    accounts,
    isBalanceVisible,

    // 配置
    managementConfigs: MANAGEMENT_CONFIGS,
    accountActions: ACCOUNT_ACTIONS,
    shopDetailFields: SHOP_DETAIL_FIELDS,

    // 计算属性
    formattedShopDetails,

    // 方法
    toggleBalanceVisibility,
    handleConfigClick,
    handleAccountAction,
    handleAddAccount,
    refreshShopInfo,
    updateAccountBalance,
    getAccountById
  }
}
