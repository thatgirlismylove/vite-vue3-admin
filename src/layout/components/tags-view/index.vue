<script setup>
import { Close } from '@element-plus/icons-vue'
import { resolve } from 'path-browserify'
import { useTagsViewStore } from '@/stores/tagsView.js'
import findDuplicates from '@/utils/findDuplicates.js'

import { constantRoutes } from '@/router/index.js'

const scrollContainer = ref()
const scrollWrapper = computed(() => scrollContainer.value.wrapRef)
const tags = ref([])

const routes = constantRoutes

const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()
const { visitedViews } = storeToRefs(tagsViewStore)

const affixTags = ref([])

const isActive = (tag) => tag.path === route.path
const isAffix = (tag) => tag?.affix

const toLastView = (visitedViews, view) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath)
  } else {
    if (view?.name === 'home') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

const closeSelectedTag = (tag) => {
  // 找出 visitedViews 中重复的视图组件，只删除当前视图，不从缓存中删除组件
  const result = findDuplicates(visitedViews.value)
  if (result.length > 0 && result.includes(tag.name)) {
    tagsViewStore.delVisitedView(tag).then((res) => {
      if (isActive(tag)) {
        toLastView(res, tag)
      }
    })
    return
  }

  tagsViewStore.delView(tag).then((res) => {
    // 当前关闭的标签是已经激活的视图，跳转到最后一个视图
    if (isActive(tag)) {
      toLastView(res.visitedViews, tag)
    }
  })
}

const filterAffixTags = (routes, basePath = '/') => {
  const tags = []
  const processRoute = (route) => {
    const tagPath = resolve(basePath, route.path)
    const tag = {
      path: tagPath,
      fullPath: tagPath,
      name: route.name,
      title: route.meta?.title || 'no-name',
      affix: route.meta?.affix,
      keepAlive: route.meta?.keepAlive
    }
    if (tag.affix) {
      tags.push(tag)
    }
    if (route.children) {
      route.children.forEach(processRoute)
    }
  }
  routes.forEach(processRoute)
  return tags
}

function initTags() {
  const tags = filterAffixTags(routes)
  affixTags.value = tags
  for (const tag of tags) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

function addTags() {
  if (route.meta.title) {
    tagsViewStore.addView(route)
  }
  return false
}

async function moveToCurrentTag() {
  await nextTick()

  const tagList = tags.value.filter(Boolean)
  for (const tag of tagList) {
    if (tag.to.path === route.path) {
      moveToTarget(tag)
      if (tag.to.fullPath !== route.fullPath) {
        // query 不同时更新 tag 信息
        tagsViewStore.updateVisitedView(route)
      }
    }
  }
}

function moveToTarget(currentTag) {
  const $container = scrollContainer.value
  const $containerWidth = $container.wrapRef.offsetWidth
  const $scrollWrapper = scrollWrapper.value
  const tagList = tags.value.filter(Boolean)

  let firstTag = null
  let lastTag = null

  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }

  if (firstTag.to.path === currentTag.to.path) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag.to.path === currentTag.to.path) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
  } else {
    // find preTag and nextTag
    const currentIndex = tagList.findIndex((item) => item === currentTag)
    const preTag = tagList[currentIndex - 1]
    const nextTag = tagList[currentIndex + 1]

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth

    // the tag's offsetLeft before of preTag
    const beforePreTagOffsetLeft = preTag.$el.offsetLeft + preTag.$el.offsetWidth

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePreTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePreTagOffsetLeft
    }
  }
}

watch(route, () => {
  addTags()
  moveToCurrentTag()
})

onMounted(() => {
  initTags()
  addTags()
})
</script>

<template>
  <div class="w-full bg-white shadow-sm border-b border-solid border-gray-200">
    <el-scrollbar ref="scrollContainer">
      <div class="flex items-center whitespace-nowrap">
        <router-link
          v-for="(tag, index) in visitedViews"
          :ref="(el) => (tags[index] = el)"
          :key="tag.path"
          :class="['tags-item', isActive(tag) ? 'active' : '']"
          :to="{ path: tag.path, query: tag.query }"
        >
          <div
            :style="{ borderColor: isActive(tag) ? 'var(--main-color)' : '' }"
            class="inline-block flex items-center gap-[12px] h-[46px] px-[16px] box-border border-b-[3px] border-solid"
          >
            <span class="text-[14px] leading-[22px] text-[var(--gray-700)]">
              {{ tag.title }}
            </span>
            <el-icon v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
              <Close />
            </el-icon>
          </div>
        </router-link>
      </div>
    </el-scrollbar>
  </div>
</template>
