import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        component: () => import('@/views/layout/MainLayout.vue'),
        children: [
            // 仪表盘
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/Dashboard.vue'),
                meta: {
                    title: '仪表盘',
                    icon: 'House',
                    requiresAuth: true
                }
            },

            // 店铺管理
            {
                path: 'shop',
                name: 'Shop',
                redirect: '/shop/base',
                meta: {
                    title: '店铺管理',
                    icon: 'Shop',
                    requiresAuth: true
                },
                children: [
                    {
                        path: 'base',
                        name: 'ShopBase',
                        component: () => import('@/views/shop/BaseInfo.vue'),
                        meta: { title: '基础信息' }
                    },
                    {
                        path: 'home',
                        name: 'ShopHome',
                        component: () => import('@/views/shop/HomeManagement.vue'),
                        meta: { title: '主页管理' }
                    },
                    {
                        path: 'category',
                        name: 'ShopCategory',
                        // 如果 category 下有多个页面，这里可以是父路由
                        component: () => import('@/views/shop/category/CategoryList.vue'),
                        meta: { title: '类型管理' }

                    },
                    {
                        path: 'member',
                        name: 'MemberManagement',
                        component: () => import('@/views/shop/MemberManagement.vue'),
                        meta: { title: '成员管理' }
                    }
                ]
            },

            // 商品管理
            // 商品管理 - 保留父路由结构，只保留商品列表一个子路由
            {
                path: 'product',
                name: 'Product',
                redirect: '/product/list',
                meta: {
                    title: '商品管理',
                    icon: 'Goods',
                    requiresAuth: true
                },
                children: [
                    {
                        path: 'list',
                        name: 'ProductList',
                        component: () => import('@/views/product/ProductList.vue'),
                        meta: { title: '商品列表' }
                    },
                    {
                        path: 'edit',
                        name: 'ProductEdit',
                        component: () => import('@/views/product/ProductEdit.vue'),
                        meta: { title: '商品编辑' }
                    }
                    // 这里只有一个子路由，以后可以添加其他子路由
                ]
            },

            // 订单配送
            {
                path: 'order',
                name: 'Order',
                redirect: '/order/list',
                meta: {
                    title: '订单配送',
                    icon: 'Box',
                    requiresAuth: true
                },
                children: [
                    {
                        path: 'list',
                        name: 'OrderList',
                        component: () => import('@/views/order/OrderList.vue'),
                        meta: { title: '订单列表' }
                    }
                ]
            },

            // 售后管理
            {
                path: 'after-sale',
                name: 'AfterSale',
                redirect: '/after-sale/list',
                meta: {
                    title: '售后管理',
                    icon: 'Service',
                    requiresAuth: true
                },
                children: [
                    {
                        path: 'list',
                        name: 'AfterSaleList',
                        component: () => import('@/views/after-sale/AfterSaleList.vue'),
                        meta: { title: '售后列表' }
                    }
                ]
            },

            // 资金结算
            {
                path: 'settlement',
                name: 'Settlement',
                redirect: '/settlement/list',
                meta: {
                    title: '资金结算',
                    icon: 'Money',
                    requiresAuth: true
                },
                children: [
                    {
                        path: 'list',
                        name: 'SettlementList',
                        component: () => import('@/views/settlement/SettlementList.vue'),
                        meta: { title: '结算列表' }
                    }
                ]
            }
        ]
    },

    // 登录页面（如果需要）
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/Login.vue'),
        meta: { hidden: true, guestOnly: true }
    },

    // 404页面
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error/404.vue'),
        meta: { hidden: true }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 添加路由守卫（如果需要）
router.beforeEach((to, from, next) => {
    // 这里可以添加权限验证逻辑
    next()
})

export default router