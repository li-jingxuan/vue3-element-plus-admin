<template>
  <div class="tags" v-if="showTags" id="manage-tab-tags-box">
    <ul ref="tagUlRef" :style="{ transform: `translateX(${translateX}px)` }">
      <li
        class="tags-li"
        v-for="(item, index) in tagsList"
        :class="{ active: isActive(item.path) }"
        :key="index"
        :ref="(el) => (tagItemRef[index] = el)"
      >
        <router-link :to="item.path" class="tags-li-title">{{ item.title }}</router-link>
        <span class="tags-li-icon" @click="closeTags(index)">
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary" style="width: 96px">
          <span class="title">标签选项</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="reload">刷新</el-dropdown-item>
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, watch, onMounted, ref, watchEffect, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import throttle from 'lodash/throttle'
import { useEmitter } from '@/utils/event-emitter'

export default defineComponent({
  emits: ['reload', 'close:tag', 'closeAll:tag'],
  setup(props, ctx) {
    const $store = useStore()
    const $route = useRoute()
    const $router = useRouter()
    const $emitter = useEmitter()
    const isActive = (path) => {
      return path === $route.fullPath
    }
    const tagsList = $store.state.tagsList

    const showTags = computed(() => tagsList.length > 0)
    // 关闭单个标签
    const closeTags = (index) => {
      const delItem = tagsList[index]
      $store.commit('delTagsItem', { index })
      const item = tagsList[index] ? tagsList[index] : tagsList[index - 1]

      if (item) {
        delItem.path === $route.fullPath && $router.push(item.path)
      } else {
        $router.push('/')
      }

      $emitter.emit('close:tag', delItem)
    }
    // 关闭全部标签
    const closeAll = () => {
      $store.commit('clearTags')
      $router.push('/')
      $emitter.emit('closeAll:tag')
    }
    // 关闭其他标签
    const closeOther = () => {
      const curItem = tagsList.filter((item) => {
        return item.path === $route.fullPath
      })
      $store.commit('clearTags')
      if (curItem && curItem.length > 0) {
        $store.commit('setTagsItem', curItem[0])
      }
      // $store.commit('closeTagsOther', curItem)
    }
    const getComponentNameByRoute = (route) => {
      // 登录页 或 设置为不需要缓存的页面 不进行缓存
      if (route.matched.length <= 1 || route.meta.keepAlive === false) {
        return ''
      }

      const _component = route.matched[1].components
      return (_component.default || _component).name || ''
    }
    // 设置标签
    const setTags = () => {
      const route = $route

      const isExist = tagsList.some((item) => {
        return item.path === route.fullPath
      })
      if (!isExist) {
        if (!route.meta.tagHidden) {
          if (tagsList.length >= 8) {
            $store.commit('delTagsItem', { index: 0 })
          }

          $store.commit('setTagsItem', {
            name: route.name,
            title: route.meta.title,
            path: route.fullPath,
            componentName: getComponentNameByRoute(route)
          })
        }
      }
    }

    const tagUlRef = ref(null)
    const tagItemRef = ref([])
    watch(() => $route.path, setTags)
    watchEffect(() => {
      const elsWidth = []
      tagItemRef.value.forEach((el) => {
        el && elsWidth.push(el.offsetWidth)
      })

      // 10px是多出来的，减少影响因素
      const ulw = elsWidth.reduce((pre, cur) => pre + cur, (elsWidth.length + 1) * 8) + 10

      if (tagUlRef.value) {
        const tagsBox = document.getElementById('manage-tab-tags-box')

        tagUlRef.value.style.width =
          ulw < tagsBox.offsetWidth ? `${tagsBox.offsetWidth}px` : `${ulw}px`
      }
    })

    const handleTags = (command) => {
      switch (command) {
        case 'reload':
          ctx.emit('reload')
          break
        case 'other':
          closeOther()
          break
        case 'all':
          if (tagsList.length === 1 && tagsList[0].path === '/dashboard') {
            return
          }
          closeAll()
          break
      }
    }
    const translateX = ref(0)
    onMounted(() => {
      setTags()
      nextTick(() => {
        const tagsBox = document.getElementById('manage-tab-tags-box')
        tagUlRef.value &&
          tagUlRef.value.addEventListener(
            'mousewheel',
            throttle((e) => {
              const tagsBoxW = tagsBox.offsetWidth
              const ulw = tagUlRef.value.offsetWidth
              const maxScroll = ulw - tagsBoxW
              const maxStep = 500

              if (maxScroll > 0) {
                let curStep = maxStep
                if (maxScroll < maxStep) {
                  curStep = maxScroll
                }

                tagsBox.scrollTo({
                  top: 0,
                  left: (e.deltaY > 0 ? curStep : -curStep) + tagsBox.scrollLeft,
                  behavior: 'smooth'
                })
              }

              // e.preventDefault() // 阻止浏览器的默认滚动
            }, 300)
          )
      })
    })

    return {
      isActive,
      closeTags,
      handleTags,
      showTags,
      tagsList,
      tagUlRef,
      tagItemRef,
      translateX
    }
  }
})
</script>

<style lang="scss" scoped>
.tags {
  position: relative;
  height: 50px;
  overflow-y: hidden;
  overflow-x: auto;
  padding-right: 130px;
  padding-left: 10px;
  background-color: #fff;
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 5%);
  &::-webkit-scrollbar {
    display: none;
  }
}

.tags ul {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  transition: all 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.tags-li {
  float: left;
  margin: 0 5px;
  border-radius: 3px;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;
  height: 28px;
  line-height: 28px;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;

  color: #909399;
  background: #f4f4f5;
  border: 1px solid #e1e1e2;
  &:hover {
    background-color: #ecf5ff;
    color: #409eff;
  }
}

.tags-li.active {
  border: 1px solid #409eff;
  background-color: #ecf5ff;
  color: #409eff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
}

.tags-li.active .tags-li-title {
  color: #409eff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 10px;
  text-align: center;
  width: 130px;
  height: 30px;
  z-index: 10;
  .title {
    font-size: 14px;
  }
}
</style>
