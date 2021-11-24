import { i18n } from '@/utils/plugins.js'
export default [
  {
    title: i18n.t('menu.platformSite'),
    icon: 'el-icon-setting',
    menuKey: 'platform',
    children: [
      {
        path: '/permissions',
        name: 'Permissions',
        meta: {
          title: i18n.t('menu.permissions'),
          keepAlive: true,
          permission: 'permissionListMng'
        },
        component: () => import('@/views/permissions/Permissions')
      }
    ]
  }
]
