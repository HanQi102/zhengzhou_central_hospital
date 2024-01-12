import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus' //引用 element-plus
import 'element-plus/dist/index.css' //引用 element-plus 样式

import router from './router' //引用路由
import http from './axios' //引用axios

import * as ElementPlusIconsVue from '@element-plus/icons-vue' //引入element-plus图标



const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$http = http


app.use(router).use(ElementPlus)
app.mount('#app')
