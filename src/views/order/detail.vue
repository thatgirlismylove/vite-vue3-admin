<script setup>
defineOptions({
  name: 'OrderDetail'
})
const value = ref('')

console.log('order detail page setup')
</script>

<template>
  <div>
    <p>order detail page</p>
    <p>id: {{ $route.params.id }}</p>
    <el-input v-model="value" style="width: 150px"></el-input>
  </div>
</template>

<style scoped></style>
