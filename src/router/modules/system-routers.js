import { i18n } from '@/utils/plugins.js'
export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: i18n.t('menu.systemHome'), icon: 'el-icon-lx-home'
    },
    component: () => import('@/views/Dashboard.vue')
  }
]
