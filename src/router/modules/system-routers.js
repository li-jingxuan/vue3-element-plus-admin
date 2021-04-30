export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: '系统首页', icon: 'el-icon-lx-home'
    },
    component: () => import('@/views/Dashboard.vue')
  },
  {
    title: 'Test',
    icon: 'el-icon-lx-home',
    menuKey: 'Test',
    children: [
      {
        path: '/test',
        name: 'test',
        meta: {
          title: 'test', icon: 'el-icon-lx-home'
        },
        component: () => import('@/views/Dashboard.vue')
      }
    ]
  }
]
