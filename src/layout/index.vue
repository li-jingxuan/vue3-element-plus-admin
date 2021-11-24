<template>
    <div class="about">
      <div class="header-bar">
        <VSidebar />
      </div>
      <div class="right-content-box">
        <VHeader />
        <div class="content-box" :class="{ 'content-collapse': collapse }">
          <VTags @reload="handleReload" />
          <div class="content">
            <router-view v-if="routerViewRefash" v-slot="{ Component, route }">
              <transition name="move" mode="out-in">
                <!-- <keep-alive v-if="getIsKeepAlive(route)"> -->
                <keep-alive :include="keepAliveList">
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
                <!-- <component v-else :is="Component" :key="route.fullPath" /> -->
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import VHeader from './widgets/Header.vue'
import VSidebar from './widgets/Sidebar.vue'
import VTags from './widgets/Tags.vue'
import { mapState } from 'vuex'

export default {
  components: { VHeader, VSidebar, VTags },
  computed: {
    ...mapState(['tagsList']),
    collapse() {
      return this.$store.state.collapse
    },
    keepAliveList() {
      const _l = this.tagsList.filter(c => c.componentName).map(c => c.componentName)

      return _l
    }
  },
  data() {
    return {
      routerViewRefash: true
    }
  },
  methods: {
    // getIsKeepAlive(route) {
    //   const isKeep = route.meta.keepAlive !== false && this.tagsList.some(c => c.path === route.path)
    //   console.log(isKeep, route)
    //   return isKeep
    // },
    handleReload() {
      this.routerViewRefash = false
      this.$nextTick(() => {
        this.routerViewRefash = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.about{
  display: flex;
  .right-content-box{
    flex: 1;
  }
}
</style>
