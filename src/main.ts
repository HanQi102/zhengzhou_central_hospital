import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus' //引用 element-plus
import 'element-plus/dist/index.css' //引用 element-plus 样式

import router from './router' //引用路由
import http from './axios' //引用axios




const app = createApp(App)
app.config.globalProperties.$http = http


app.use(router).use(ElementPlus)
app.mount('#app')
