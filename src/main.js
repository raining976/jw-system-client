import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router'
const app = createApp(App)
// Import our custom CSS
import './style/scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import * as api from '@/api'
app.config.globalProperties.$api = api


// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store).use(router).mount('#app') // # 是id选择器
