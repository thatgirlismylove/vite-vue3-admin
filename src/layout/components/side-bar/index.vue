<script setup>
import CustomMenuItem from '@/layout/components/custom-menu-item/index.vue'
import { Fold, Expand } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const router = useRouter()

const menuData = computed(() => {
  const routes = router.options.routes
  // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
  return routes.map((item) => {
    // 只有一个子路由
    if (item.children && item.children.length === 1) {
      return item.children[0]
    }
    return item
  })
})

console.log('data:', menuData.value)

const handleSelect = (path) => {
  console.log('path:', path)
  router.push(path)
}
</script>

<template>
  <div class="flex w-auto h-full flex-col justify-between border-r border-solid border-[#E7E7E7]">
    <!-- 侧边栏高度 = 浏览器高度 - 头部高度 - 底部高度 -->
    <el-scrollbar style="height: calc(100vh - 60px - 60px); flex-shrink: 0">
      <el-menu :default-active="$route.path" :collapse="isCollapse" @select="handleSelect">
        <CustomMenuItem :data="menuData" />
      </el-menu>
    </el-scrollbar>
    <div class="pl-[22px] flex items-center w-full h-[60px] border-t border-solid border-[#E7E7E7]">
      <div
        class="flex items-center justify-center cursor-pointer"
        @click="isCollapse = !isCollapse"
      >
        <el-icon size="22">
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item) {
  width: 232px;
}

:deep(.el-menu-item.is-active) {
  background: #f8f3ed;
}
</style>
