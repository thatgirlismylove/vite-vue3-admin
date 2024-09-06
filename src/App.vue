<script setup>
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useLanguageStore } from './stores/language'

const languageStore = useLanguageStore()

const language = computed(() => (languageStore.currentLanguage.value === 'zh' ? zhCn : en))
</script>

<template>
  <el-config-provider :locale="language">
    <RouterView />
  </el-config-provider>
</template>
