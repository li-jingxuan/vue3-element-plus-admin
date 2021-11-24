<template>
  <div class="sidebar">
    <div class="logo-box">
      <div v-show="collapse" class="small-logo" />
      <div v-show="!collapse" class="open-logo" />
    </div>
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="(item, i1) in meuns">
        <template v-if="item.children && item.children.length">
          <el-submenu :index="item.menuKey" :key="i1">
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="(subItem, i2) in item.children">
              <el-submenu
                v-if="subItem.children && subItem.children.length && !subItem.hidden"
                :index="subItem.path"
                :key="i2"
              >
                <template #title>{{ subItem.title }}</template>
                <!-- 第三层子菜单 -->
                <template v-for="(threeItem, threeItemIndex) in subItem.children">
                  <el-menu-item
                    v-if="
                      !threeItem.meta.hidden && getPremisson(threeItem, subItem, threeItemIndex)
                    "
                    :key="threeItem.path"
                    :index="threeItem.path"
                  >
                    <i class="dot"></i>{{ threeItem.meta.title }}
                  </el-menu-item>
                </template>
              </el-submenu>
              <!-- 第二层子菜单 -->
              <el-menu-item
                v-if="!subItem.children && !subItem.meta.hidden && getPremisson(subItem, item, i2)"
                :index="subItem.path"
                :key="subItem.path"
              >
                <i class="dot"></i>{{ subItem.meta.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-if="!item.children && !item.meta.hidden && getPremisson(item, meuns, i1)">
          <el-menu-item :index="item.path" :key="item.path">
            <i style="position: relative; right: 7px; bottom: 4px" :class="item.meta.icon"></i>
            <template #title>
              <span style="position: relative; right: 7px; bottom: 4px">{{ item.meta.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import routerConfig from '@/router'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useEmitter } from '@/utils/event-emitter'

export default defineComponent({
  setup() {
    const route = useRoute()
    const store = useStore()
    const emitter = useEmitter()
    const onRoutes = computed(() => route.path)
    const collapse = computed(() => store.state.collapse)

    // 是否显示菜单
    const getPremisson = (route) => {
      const { userInfo } = store.state

      // 如果
      if (!route.meta || route.meta.permission === 'all') {
        return true
      }
      // 没有登录
      if (!userInfo || !userInfo.permission) {
        return false
      }

      // 当前页面没有配置权限
      if (!route.meta || !route.meta.permission) {
        return true
      }

      const systemPermission = userInfo.permission.codePaths || []

      if (systemPermission.includes(route.meta.permission)) {
        return true
      }

      return false
    }

    // 过滤没有权限的菜单
    const formatEmuns = (list) => {
      const newArray = list.filter((item) => getPremisson(item))

      newArray.forEach((item) => {
        if (item.children) {
          item.children = formatEmuns(item.children)
        }
      })
      return newArray
    }

    // 深拷贝权限对象
    const initMeuns = formatEmuns(JSON.parse(JSON.stringify(routerConfig.sidebarConfig)))
    const meuns = ref(initMeuns || [])
    // 权限变更更新菜单
    emitter.on('update:role', () => {
      meuns.value = formatEmuns(JSON.parse(JSON.stringify(routerConfig.sidebarConfig)))
    })

    return {
      meuns,
      onRoutes,
      collapse,
      getPremisson
    }
  }
})
</script>

<style lang="scss" scoped>
.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 10px;
  box-sizing: border-box;
  @include sidebar_dot($s_act-font-color-black-theme);
}
.sidebar {
  height: 100vh;
  position: relative;
  z-index: 2;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 180px;
}
.sidebar-el-menu {
  border-right: none;
}
.sidebar > ul {
  overflow: auto;
  height: calc(100% - 45px);
  width: 55px;
}

.sidebar > ul::-webkit-scrollbar {
  width: 0;
}

.sidebar > .sidebar-el-menu {
  @include sidebar_bg_color($s_bg-black-theme);
}

.logo-box {
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  @include sidebar_bg_color($s_bg-black-theme);
  @include logobox-borderbottom();
  .open-logo {
    height: 45px;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    @include sidebar_bg_image($s_bacground-image-black-theme);
  }
  .small-logo {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    height: 45px;
    @include sidebar_small-logo($s_small-logo-white-theme);
  }
}
</style>
