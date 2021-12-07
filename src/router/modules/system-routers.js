import { i18n } from '@/utils/plugins.js'
export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: i18n.t('menu.systemHome'), icon: 'el-icon-lx-home'
    },
    component: () => import('@/views/Dashboard.vue')
  },
  {
    title: i18n.t('menu.doc'),
    icon: 'el-icon-setting',
    menuKey: 'doc',
    children: [{
      path: '/doc',
      name: 'doc',
      meta: {
        title: i18n.t('menu.doc')
      },
      component: () => import('@/views/Test.vue')
    }]
  }
]
