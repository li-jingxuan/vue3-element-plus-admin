<template>
  <div
    class="theme-list"
    v-for="theme in themes"
    :key="theme.name"
  >
    <div class="title">{{ theme.title }}</div>
    <div class="theme-content">
      <div
        class="theme-item"
        v-for="(item, i) in theme.list"
        :key="i"
        @click="handleThemeClick(theme.name, item)"
      >
        <img :src="item.imgUrl" alt="">
        <p>{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const themes = [
      {
        title: '顶栏主题',
        name: 'header',
        list: [
          { value: 'white', label: '白色顶栏', imgUrl: require('../img/nav-theme-light.svg') },
          { value: 'black', label: '黑色顶栏', imgUrl: require('../img/header-theme-dark.svg') }
        ]
      },
      {
        title: '侧边栏主题',
        name: 'sidebar',
        list: [
          { value: 'white', label: '白色侧边栏', imgUrl: require('../img/nav-theme-light.svg') },
          { value: 'black', label: '黑色侧边栏', imgUrl: require('../img/nav-theme-dark.svg') }
        ]
      }
    ]

    const handleThemeClick = (name, theme) => {
      store.commit('setTheme', {
        key: name,
        val: theme.value
      })
    }
    return {
      themes,
      handleThemeClick
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-list{
  margin-top: 15px;
  &:first-child{
    margin-top: 0;
  }
}
.theme-content{
  display: flex;
  margin-top: 10px;
  justify-content: space-around;
  .theme-item{
    cursor: pointer;
    user-select: none;
    text-align: center;
    padding: 0 10px;
    p{
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
