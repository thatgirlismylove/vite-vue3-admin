import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'

import 'dayjs/locale/zh-cn'

import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

// 需要放在 reset/tailwind.css 之后引入，以防止 tailwind 覆盖了 button 按钮样式
import './styles/index.scss'

import '@/permission'

import operatorPermission from './directives/operatorPermission.js'

// 国际化配置
import i18n from './language/index.js'

const app = createApp(App)

app.directive('permission', operatorPermission)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia).use(ElementPlus).use(router).use(i18n).mount('#app')
