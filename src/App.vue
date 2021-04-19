<template>
    <router-view />
</template>

<script>
import { defineComponent, onMounted, watch, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const store = useStore()
    const htheme = ref(store.state.headerTheme)
    const stheme = ref(store.state.sidebarTheme)

    watch(
      () => store.state.headerTheme,
      () => {
        const appEl = document.getElementById('app')
        console.log('watch', htheme.value)
        appEl && appEl.setAttribute('data-header-theme', store.state.headerTheme)
      })
    watch(
      () => store.state.sidebarTheme,
      () => {
        const appEl = document.getElementById('app')

        appEl && appEl.setAttribute('data-sidebar-theme', store.state.sidebarTheme)
      }
    )

    onMounted(() => {
      const appEl = document.getElementById('app')
      if (!appEl) {
        return
      }

      appEl.setAttribute('data-header-theme', htheme.value)
      appEl.setAttribute('data-sidebar-theme', stheme.value)
    })
  }
})
</script>

<style lang="scss">
@import "./assets/css/main.css";
</style>
