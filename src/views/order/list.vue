<script setup>
import { getOrderList } from '@/mock/order.js'
import { useFetch } from '@/hooks/useFetch.js'
// const router = useRouter()

defineOptions({
  name: 'OrderList'
})

const { execute, data } = useFetch(getOrderList, {
  immediate: false
})

onMounted(() => {
  execute()
})

console.log(data)

// const orderDetail = (id) => router.push('/order/detail/' + id)
</script>

<template>
  <div>
    <div>order list page</div>
    <!-- <p @click="orderDetail(item)" v-for="item in data.list" :key="item">order: {{ item }}</p> -->
  </div>
</template>
