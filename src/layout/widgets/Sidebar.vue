<template>
  <div class="sidebar">
    <div class="logo-box">
      <div v-show="collapse" class="small-logo"></div>
      <div v-show="!collapse" class="open-logo">
      </div>
    </div>
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="(item, i1) in meuns">
        <template v-if="item.children">
          <el-submenu :index="item.menuKey" :key="i1">
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="(subItem, i2) in item.children">
              <el-submenu
                v-if="subItem.children"
                :index="subItem.path"
                :key="i2"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="threeItem in subItem.children"
                  :key="threeItem.path"
                  :index="threeItem.path"
                >
                  {{ threeItem.meta.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.path" :key="subItem.path">{{
                subItem.meta.title
              }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path" :key="item.path">
            <i :class="item.meta.icon"></i>
            <template #title>{{ item.meta.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue'
import routerConfig from '@/router'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const route = useRoute()
    const store = useStore()

    const meuns = reactive(routerConfig.sidebarConfig)
    const onRoutes = computed(() => route.path)
    const collapse = computed(() => store.state.collapse)

    return {
      meuns,
      onRoutes,
      collapse
    }
  }
})
</script>

<style lang="scss">
.el-menu--inline{
  @include sidebar_bg_color($s_bg-black-theme);
}
.el-menu-item{
  @include sidebar_font_color_sec($s_font-color-black-themesec);
  i{
    @include sidebar_font_color_sec($s_font-color-black-themesec);
  }
}
.el-submenu__title {
  @include sidebar_font_color_sec($s_font-color-black-themesec);
  i {
    @include sidebar_font_color_sec($s_font-color-black-themesec);
  }
}

// 激活
.el-menu-item.is-active{
  @include sidebar_font_act_color($s_font-color-black-theme);
  @include sidebar_font_act_bg_color($s_act-bg-white-theme);
}
// hover
.el-menu-item:focus, .el-menu-item:hover{
  @include sidebar_font_act_color($s_act-font-color-white-theme);
  @include sidebar_bg_color($s_bg-black-theme);
  i{
    @include sidebar_font_act_color($s_act-font-color-white-theme);
  }
}
.el-submenu__title:hover{
  @include sidebar_font_act_color($s_act-font-color-white-theme);
  @include sidebar_bg_color($s_bg-black-theme);
  i{
    @include sidebar_font_act_color($s_act-font-color-white-theme);
  }
}
</style>

<style lang="scss" scoped>
.sidebar {
  height: 100vh;
  position: relative;
  z-index: 2;
  box-shadow: 2px 0 8px 0 rgba(29,35,41,.05);
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar-el-menu{
  border-right: none;
}
.sidebar > ul {
  overflow: auto;
  height: calc(100% - 45px);
}

.sidebar > ul::-webkit-scrollbar {
  width: 0;
}

.sidebar > .sidebar-el-menu{
  @include sidebar_bg_color($s_bg-black-theme);
}

.logo-box{
  height: $headerHeight;
  display: flex;
  justify-content: center;
  align-items: center;
  @include sidebar_bg_color($s_bg-black-theme);
  @include logobox-borderbottom();
  .open-logo{
    height: 45px;
    width: 100%;
    background-image: url("../../assets/img/login.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .small-logo{
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    height: 45px;
    background-image: url("../../assets/img/small-logo.png");
  }
}
</style>
