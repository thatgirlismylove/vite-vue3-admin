<script setup>
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const currentLanguage = computed(() => languageStore.currentLanguage)

const switchLanguage = () => {
  languageStore.switchLanguage()
}
</script>

<template>
  <div class="cursor-pointer" @click="switchLanguage">
    <span :class="[currentLanguage === 'zh' ? 'actived' : '']">中文</span>
    <span> / </span>
    <span :class="[currentLanguage === 'en' ? 'actived' : '']">English</span>
  </div>
</template>

<style scpoed>
.actived {
  font-weight: 600;
  color: var(--main-color);
}
</style>
