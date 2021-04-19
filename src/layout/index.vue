<template>
    <div class="about">
      <div class="header-bar">
        <VSidebar />
      </div>
      <div class="right-content-box">
        <VHeader />
        <div class="content-box" :class="{ 'content-collapse': collapse }">
          <VTags />
          <div class="content">
            <router-view v-slot="{ Component }">
              <transition name="move" mode="out-in">
                <keep-alive :include="tagsList">
                  <component :is="Component" />
                </keep-alive>
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

export default {
  components: { VHeader, VSidebar, VTags },
  computed: {
    tagsList () {
      return this.$store.state.tagsList.map(item => item.name)
    },
    collapse () {
      return this.$store.state.collapse
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
