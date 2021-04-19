<template>
    <div class="tags" v-if="showTags" id="manage-tab-tags-box">
      <ul ref="tagUlRef" :style="{ transform: `translateX(${translateX}px)` }">
        <li
          class="tags-li"
          v-for="(item,index) in tagsList"
          :class="{'active': isActive(item.path)}"
          :key="index"
          :ref="(el) => tagItemRef[index] = el"
        >
          <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link>
          <span class="tags-li-icon" @click="closeTags(index)">
            <i class="el-icon-close"></i>
          </span>
        </li>
      </ul>
      <div class="tags-close-box">
        <el-dropdown @command="handleTags">
          <el-button size="mini" type="primary">
            标签选项
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu size="small">
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

export default defineComponent({
  setup () {
    const $store = useStore()
    const $route = useRoute()
    const $router = useRouter()
    const isActive = (path) => {
      return path === $route.fullPath
    }
    const tagsList = $store.state.tagsList
    const showTags = computed(() => tagsList.length > 0)
    // 关闭单个标签
    const closeTags = (index) => {
      const delItem = tagsList[index]
      $store.commit('delTagsItem', { index })
      const item = tagsList[index]
        ? tagsList[index]
        : tagsList[index - 1]
      if (item) {
        delItem.path === $route.fullPath && $router.push(item.path)
      } else {
        $router.push('/')
      }
    }
    // 关闭全部标签
    const closeAll = () => {
      $store.commit('clearTags')
      $router.push('/')
    }
    // 关闭其他标签
    const closeOther = () => {
      const curItem = tagsList.filter(item => {
        return item.path === this.$route.fullPath
      })
      $store.commit('closeTagsOther', curItem)
    }
    // 设置标签
    const setTags = () => {
      const route = $route
      const isExist = tagsList.some(item => {
        return item.path === route.fullPath
      })
      if (!isExist) {
        if (tagsList.length >= 8) {
          $store.commit('delTagsItem', { index: 0 })
        }
        $store.commit('setTagsItem', {
          name: route.name,
          title: route.meta.title,
          path: route.fullPath
        })
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

        tagUlRef.value.style.width = ulw < tagsBox.offsetWidth ? `${tagsBox.offsetWidth}px` : `${ulw}px`
      }
    })

    const handleTags = (command) => {
      command === 'other' ? closeOther() : closeAll()
    }
    const translateX = ref(0)
    onMounted(() => {
      setTags()
      nextTick(() => {
        const tagsBox = document.getElementById('manage-tab-tags-box')
        tagUlRef.value.addEventListener(
          'mousewheel',
          throttle((e) => {
            console.log('e', e, tagUlRef.value.offsetWidth)
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
    height: 30px;
    overflow-y: hidden;
    overflow-x: auto;
    padding-right: 130px;
    padding-left: 10px;
    &::-webkit-scrollbar{
      display: none;
    }
}

.tags ul {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    transition: all .3s;
    white-space: nowrap;
}

.tags-li {
  float: left;
  margin: 0 5px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 28px;
  line-height: 28px;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
  &:hover{
    color: #409EFF;
  }
}

.tags-li.active {
    color: #fff;
    border: 1px solid #409EFF;
    background-color: #409EFF;
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
    color: #fff;
}

.tags-close-box {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding-top: 1px;
    text-align: center;
    width: 110px;
    height: 30px;
    // background: #fff;
    /* box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1); */
    z-index: 10;
}
</style>
