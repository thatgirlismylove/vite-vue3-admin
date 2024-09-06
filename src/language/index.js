import { createI18n } from 'vue-i18n' //引入vue-i18n组件
import zh from './zh'
import en from './en'
//注册i18n实例并引入语言文件
const i18n = createI18n({
  legacy: false, // 设置成 `false`, 才能使用 Composition API
  locale: 'zh', // 默认语言
  globalInjection: true, // 表明使用全局t函数，vue-i18n v9.2-beta.34 or later, globalInjection is true by default
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  }
})
export default i18n
