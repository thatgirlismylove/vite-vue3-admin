import router from '@/router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { getToken } from '@/utils/storage'

// 白名单路由
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const hasToken = getToken() || 1
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，跳转首页
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
