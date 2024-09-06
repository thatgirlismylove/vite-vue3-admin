import axios from 'axios'
import { stringify } from 'qs'
import { getToken, removeToken } from '@/utils/storage.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers.Authorization = getToken()
    }
    if (
      config.method == 'post' &&
      config.headers['Content-Type'] == 'application/x-www-form-urlencoded'
    ) {
      /** 是post请求，并且请求头是application/x-www-form-urlencoded*/
      config.data = stringify(config.data)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data
    if (code === '00000') {
      return response.data
    }
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response
    }

    ElMessage.error(msg || '系统出错')
    return Promise.reject(new Error(msg || 'Error'))
  },
  (error) => {
    if (error.response.data) {
      const { code, msg } = error.response.data
      // token 过期,重新登录
      if (code === '401') {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          // 移除 token,重新加载页面
          removeToken().then(() => {
            location.reload()
          })
        })
      } else {
        ElMessage.error(msg || '系统出错')
      }
    }
    return Promise.reject(error.message)
  }
)

// 导出 axios 实例
export default service
