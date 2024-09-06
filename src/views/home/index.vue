<script setup>
// 需要定义组件名称 供 keep alive 使用
defineOptions({
  name: 'Home' // 定义组件名称，否则 setup 会默认使用文件名称作为组件名
})
const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles'
}
const tableData = ref(Array.from({ length: 20 }).fill(item))
</script>

<template>
  <el-table :data="tableData">
    <el-table-column prop="date" label="Date" width="140" />
    <el-table-column prop="name" label="Name" width="120" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<style scoped></style>
