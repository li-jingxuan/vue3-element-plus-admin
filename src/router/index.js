import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout'
// import defaultRouter from './modules/default'
import systemRouters from './modules/system-routers'
import { isPermission } from '@/utils/permission'

const routerConfig = [
  ...systemRouters
]

const routers = []
function routerFormat (tree) {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]

    if (item.children && item.children.length > 0) {
      routerFormat(item.children)
    } else {
      routers.push(item)
    }
  }
}

routerFormat(routerConfig)
const routes = [
  // 根路由
  {
    path: '/',
    redirect: '/dashboard'
  },
  // 登录
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/Login.vue')
  },
  // 后台主路由
  {
    path: '/',
    name: 'Home',
    component: Layout,
    children: [
      ...routers,
      // 权限不足
      {
        path: '/403',
        component: () => import('@/views/403.vue'),
        meta: { title: '403' }
      },
      // 404 页面应该放在路由最后面
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/404.vue'),
        meta: { title: '404' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // 设置title信息
  document.title = `${to.meta.title} | perfee`
  // 权限控制
  isPermission(to) ? next() : next('/403')
})

export default { router, sidebarConfig: routerConfig }
