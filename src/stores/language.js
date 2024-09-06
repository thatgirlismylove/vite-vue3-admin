import { useI18n } from 'vue-i18n'

export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()

  const currentLanguage = ref('zh') // 默认中文

  // 中英文切换 zh en
  const switchLanguage = (language) => {
    if (language) {
      currentLanguage.value = language
      locale.value = language
    } else {
      const language = currentLanguage.value === 'zh' ? 'en' : 'zh'
      currentLanguage.value = language
      locale.value = language
    }
  }

  return {
    currentLanguage,
    switchLanguage
  }
})
