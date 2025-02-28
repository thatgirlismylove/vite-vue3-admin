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

// 右击tag 操作菜单
const visible = ref(false)
const left = ref(0)
const top = ref(0)
const selectedTag = ref({
	path: '',
	fullPath: '',
	name: '',
	title: '',
	affix: false,
	keepAlive: false
})

watch(visible, (value) => {
	if (value) {
		document.body.addEventListener('click', closeMenu)
	} else {
		document.body.removeEventListener('click', closeMenu)
	}
})

function openMenu(tag, event) {
	const el = scrollWrapper.value

	const menuMinWidth = 105
	const offsetLeft = el.getBoundingClientRect().left // 当前组件左边距离屏幕边缘
	const offsetWidth = el.offsetWidth // 当前组件宽度
	const maxLeft = offsetWidth - menuMinWidth // 左边最大范围
	const l = event.clientX - offsetLeft + 15 // 15 偏移量

	if (l > maxLeft) {
		left.value = maxLeft
	} else {
		left.value = l
	}

	top.value = event.clientY - 48 // 减去头部高度
	visible.value = true
	selectedTag.value = tag
}

function closeMenu() {
	visible.value = false
}

// 关闭其他
const closeOthersTags = () => {
	router.push(selectedTag.value)
	tagsViewStore.delOtherViews(selectedTag.value).then(() => {
		moveToCurrentTag()
	})
}
// 关闭所有
function closeAllTags(view) {
	tagsViewStore.delAllViews().then(({ visitedViews }) => {
		toLastView(visitedViews, view)
	})
}

// 刷新
const refreshSelectedTag = (view) => {
	tagsViewStore.delCachedView(view)
	const { fullPath } = view
	nextTick(() => {
		router.replace('/redirect' + fullPath)
	})
}
// 关闭左侧
const closeLeftTags = () => {
	tagsViewStore.delLeftViews(selectedTag.value).then((res) => {
		if (!res.visitedViews.find((item) => item?.path === route?.path)) {
			toLastView(res.visitedViews)
		}
	})
}
// 关闭右侧
const closeRightTags = () => {
	tagsViewStore.delRightViews(selectedTag.value).then((res) => {
		if (!res.visitedViews.find((item) => item?.path === route?.path)) {
			toLastView(res.visitedViews)
		}
	})
}

const handleScroll = () => {
	closeMenu()
}
</script>

<template>
	<div class="w-full bg-white shadow-sm border-b border-solid border-gray-200 relative">
		<el-scrollbar ref="scrollContainer" @wheel.prevent="handleScroll">
			<div class="flex items-center whitespace-nowrap">
				<router-link
					v-for="(tag, index) in visitedViews"
					:ref="(el) => (tags[index] = el)"
					:key="tag.path"
					:class="['tags-item', isActive(tag) ? 'active' : '']"
					:to="{ path: tag.path, query: tag.query }"
					@click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
					@contextmenu.prevent="openMenu(tag, $event, index)"
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

		<ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
			<li @click="refreshSelectedTag(selectedTag)">刷新</li>
			<li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
			<li @click="closeOthersTags">关闭其它</li>
			<li @click="closeLeftTags(selectedTag)">关闭左侧</li>
			<li @click="closeRightTags(selectedTag)">关闭右侧</li>
			<li @click="closeAllTags(selectedTag)">关闭所有</li>
		</ul>
	</div>
</template>

<style scoped lang="scss">
// 鼠标右键 展示菜单
.contextmenu {
	position: absolute;
	z-index: 999;
	padding: 5px 0;
	margin: 0;
	font-size: 12px;
	font-weight: 400;
	color: #333;
	list-style-type: none;
	background: #fff;
	border-radius: 4px;
	box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);

	li {
		padding: 7px 16px;
		margin: 0;
		cursor: pointer;

		&:hover {
			background: #eee;
		}
	}
}
</style>
