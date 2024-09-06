<template>
  <el-breadcrumb
    :separator-icon="ArrowRight"
    class="h-[50px] flex items-center text-[14px] leading-[22px] box-border"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
          v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1"
          class="font-semibold text-[var(--title-color)]"
          >{{ item.meta.title }}</span
        >
        <span class="text-[var(--gray-500)] cursor-pointer" v-else @click="handleLink(item)">
          {{ item.meta.title }}
        </span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { compile } from 'path-to-regexp'
import router from '@/router/index.js'
import { ArrowRight } from '@element-plus/icons-vue'

const currentRoute = useRoute()
const breadcrumbs = ref([])

const pathCompile = (path) => {
  const { params } = currentRoute
  const toPath = compile(path)
  return toPath(params)
}

function getBreadcrumb() {
  let matched = currentRoute.matched.filter(
    // title 面包屑中展示的标题,必须
    (item) => item.meta && item.meta.title
  )
  breadcrumbs.value = matched.filter((item) => {
    // 配置路由在面包屑中展示 breadcrumb = true
    return item.meta && item.meta.title && item.meta.breadcrumb !== false
  })
}

watch(
  () => currentRoute.path,
  (path) => {
    // 重定向页面不更新面包屑
    if (path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  }
)

function handleLink(item) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err)
    })
    return
  }
  router.push(pathCompile(path)).catch((err) => {
    console.warn(err)
  })
}

onBeforeMount(() => {
  getBreadcrumb()
})
</script>
