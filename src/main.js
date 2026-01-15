import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import './assets/styles/global.scss'

// 引入中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 引入中文语言包

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus, {
  locale: zhCn // 配置中文语言环境
})

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用路由
app.use(router)
app.use(pinia)

// 使用 Pinia（状态管理）
app.use(createPinia())

// 使用 Element Plus
app.use(ElementPlus)

app.mount('#app')