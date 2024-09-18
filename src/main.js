import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import 'dayjs/locale/zh-cn'

import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'

import './styles/index.scss'

import '@/permission'

import operatorPermission from './directives/operatorPermission.js'

// 国际化配置
import i18n from './language/index.js'

const app = createApp(App)

app.directive('permission', operatorPermission)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia).use(router).use(i18n).mount('#app')
