import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

export const useFetch = (
  fetch,
  {
    immediate = true,
    effectArray = [],
    beforeFetch,
    afterFetch,
    onSuccess,
    onError,
    updateDataOnError = false,
    initialData = null
  } = {
    immediate: true,
    updateDataOnError: false,
    effectArray: [],
    initialData: null
  }
) => {
  const isLoading = ref(false)
  const isFinished = ref(false)
  const data = ref(initialData)
  const response = ref(null)
  const error = ref(null)

  const execute = () => {
    beforeFetch && beforeFetch()
    isLoading.value = true
    isFinished.value = false
    error.value = null
    fetch()
      .then((res) => {
        response.value = res
        if (res?.status === '00000') {
          onSuccess && onSuccess(res)
          data.value = res.data
        } else {
          ElMessage.error(res?.message)
          if (updateDataOnError) {
            data.value = null
          }
        }
      })
      .catch((e) => {
        onError && onError(e)
        error.value = e
      })
      .finally(() => {
        afterFetch && afterFetch()
        isLoading.value = false
        isFinished.value = true
      })
  }

  if (immediate) {
    execute()
  }

  // 监听依赖项发生变化，重新发起请求
  if (effectArray.length > 0) {
    watch(effectArray, execute)
  }

  return {
    isLoading,
    isFinished,
    response,
    error,
    data,
    execute
  }
}
