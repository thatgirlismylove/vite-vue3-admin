<script setup>
import Header from './components/header/index.vue'
import Footer from './components/footer/index.vue'
import SideBar from '@/layout/components/side-bar/index.vue'
import BreadCrumb from '@/components/bread-crumb/index.vue'
import TagsView from '@/layout/components/tags-view/index.vue'
import { useTagsViewStore } from '@/stores/tagsView.js'
import { computed } from 'vue'

const tagsViewStore = useTagsViewStore()
const cachedViews = computed(() => tagsViewStore.cachedViews)
</script>

<template>
  <div class="flex flex-col w-full h-screen box-border overflow-hidden">
    <!-- 头部 -->
    <Header />
    <div class="w-full flex-1 flex">
      <!-- 侧边栏菜单 -->
      <SideBar />
      <div class="flex flex-col flex-1 max-w-full h-full relative bg-[var(--gray)] overflow-hidden">
        <!-- 标签栏 -->
        <TagsView />
        <div class="w-full flex-1 bg-[var(--gray)] px-[20px] pb-[20px]">
          <!-- 面包屑 -->
          <BreadCrumb class="p-y-[16px]" />
          <div style="height: calc(100vh - 216px)" class="overflow-auto">
            <!-- 路由视图 内容区域 -->
            <router-view v-slot="{ Component, route }">
              <transition name="fade-transform" mode="out-in">
                <!-- 如果不需要缓存页面，删除 keep-alive 组件以及 component key 属性-->
                <keep-alive :include="cachedViews">
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>
