import { createRouter, createWebHistory } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        hidden: true,
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    hidden: true,
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    name: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'Home', // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
        meta: {
          title: 'home',
          icon: 'homepage',
          affix: true,
          roles: ['admin', 'editor'],
          keepAlive: true,
          breadcrumb: true
        }
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    component: Layout,
    redirect: '/order/list',
    meta: {
      title: 'order'
    },
    children: [
      {
        path: '/list',
        component: () => import('@/views/order/list.vue'),
        name: 'OrderList',
        meta: {
          title: 'orderList',
          icon: 'homepage',
          affix: false,
          roles: ['admin', 'editor'],
          keepAlive: true,
          breadcrumb: true
        }
      },
      {
        path: '/history',
        component: () => import('@/views/history/index.vue'),
        name: 'History',
        meta: {
          title: 'history',
          icon: 'homepage',
          affix: false,
          roles: ['admin', 'editor'],
          keepAlive: true,
          breadcrumb: true
        }
      },
      {
        path: '/detail/:id',
        component: () => import('@/views/order/detail.vue'),
        name: 'OrderDetail',
        meta: {
          title: 'orderDetail',
          icon: 'homepage',
          affix: false,
          roles: ['admin', 'editor'],
          keepAlive: true,
          breadcrumb: true
        }
      }
    ]
  },
  // 404
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    hidden: true,
    component: () => import('@/components/not-found/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/client'),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 重置路由
export function resetRouter() {
  router.replace({ path: '/login' })
}

export default router
