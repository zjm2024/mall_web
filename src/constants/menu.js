export const menuList = [
  {
    title: '仪表盘',
    icon: 'House',
    path: '/dashboard'
  },
  {
    title: '店铺管理',
    icon: 'Shop',
    children: [
      { title: '基础信息', path: '/shop/base' },
      { title: '主页管理', path: '/shop/home' },
      { title: '类型管理', path: '/shop/category' },
      { title: '成员管理', path: '/shop/member' }
    ]
  },
  {
    title: '商品管理',
    icon: 'Goods',
    children: [
      { title: '商品列表', path: '/product/list' }
    ]
  },
  {
    title: '订单配送',
    icon: 'Box',
    children: [
      { title: '订单列表', path: '/order/list' }
    ]
  },
  {
    title: '售后管理',
    icon: 'Service',
    children: [
      { title: '售后列表', path: '/after-sale/list' }
    ]
  },
  {
    title: '资金结算',
    icon: 'Money',
    children: [
      { title: '结算列表', path: '/settlement/list' }
    ]
  }
]