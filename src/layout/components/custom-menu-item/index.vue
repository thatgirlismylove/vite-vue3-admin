<script setup>
defineOptions({
  name: 'CustomMenuItem'
})
defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <template v-for="item in data" :key="item.path">
    <template v-if="!item.hidden">
      <el-sub-menu v-if="item.children" :index="item.path">
        <template #title>
          {{ item.meta?.title }}
        </template>
        <CustomMenuItem :data="item.children" />
      </el-sub-menu>
      <el-menu-item v-else :index="item.path">{{ item.meta?.title }}</el-menu-item>
    </template>
  </template>
</template>
