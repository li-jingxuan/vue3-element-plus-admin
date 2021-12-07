<template>
  <div class="header-box">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="welcome">
      <span style="margin-right: 10px">欢迎您</span>
      {{ userInfo?.username || '未知' }}
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <div class="header-item">
          <el-popover placement="bottom" :width="200" trigger="click">
            <template #reference>
              <span class="theme-btn">
                主题
                <i class="el-icon-caret-bottom"></i>
              </span>
            </template>
            <div class="theme-content">
              <Theme />
            </div>
          </el-popover>
        </div>

        <!-- 【此注释有实际意义，国际化切换，不可删除】 -->
        <!-- 目前仅支持中文 -->
        <div class="header-item">
          <el-dropdown trigger="click" @command="handleLanguagesChange">
            <span class="el-dropdown-link">
              <span class="font-color">
                {{ localLanguages }}
                <i class="el-icon-caret-bottom"></i>
              </span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in languages"
                  :key="item.value"
                  divided
                  :command="item.value"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 用户头像 -->
        <div class="user-avator">
          <img
            :src="userInfo?.avatar || require('@/assets/img/small-logo.png')"
          />
        </div>
        <!-- 用户名下拉菜单 -->
        <div class="user-name">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link font-color">
              {{ userInfo?.username || '未知' }}
              <i class="el-icon-caret-bottom"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item divided command="loginout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Theme from './Theme.vue'

export default defineComponent({
  components: {
    Theme
  },
  setup(props, ctx) {
    const store = useStore()
    const userInfo = store.state.userInfo
    const router = useRouter()
    const self = getCurrentInstance()
    const languages = [
      { value: 'en', label: 'English' },
      { value: 'zh-cn', label: '中文' }
    ]

    const theme = ref('theme1')
    // const userInfo = computed(() => (user ? user.userInfo : null))
    const collapse = computed(() => store.state.collapse)
    const localLanguages = computed(() => {
      const val = store.state.localLanguages
      if (!val) {
        return languages[0].label
      }

      return languages.filter((item) => item.value === val)[0].label
    })

    // 用户名下拉菜单选择事件
    const handleCommand = (command) => {
      if (command === 'loginout') {
        store.commit('logout')
        // 退出登录清除 tags
        store.commit('clearTags')
        router.replace('/login')
      }
    }

    // 侧边栏折叠
    const collapseChage = () => {
      store.commit('hadndleCollapse', !collapse.value)
    }

    const handleLanguagesChange = (value) => {
      const local = languages.filter((item) => item.value === value)[0]
      store.commit('setLocalLanguages', local.value)

      self.ctx.$i18n.locale = local.value
      location.reload()
    }

    const handleThemeChange = (cmd) => {
      theme.value = cmd
      window.document.documentElement.setAttribute('data-header-theme', cmd)
    }

    return {
      localLanguages,
      theme,
      languages,
      userInfo,
      collapse,
      handleCommand,
      collapseChage,
      handleLanguagesChange,
      handleThemeChange
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import "~@/assets/css/theme/mixin.scss";

.font-color {
  @include header_font_color($h_font-color-white-theme);
}
.font-color-sec {
  @include header_font_color_sec($h_font-color-white-theme);
}
.header-box {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: $headerHeight;
  font-size: 22px;
  @include header_bg_color($h_bg-white-theme);
  @include header_font_color($h_font-color-white-theme);
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: $headerHeight;
}
.header-box .welcome {
  font-size: 14px;
  float: left;
  line-height: $headerHeight;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: $headerHeight;
  align-items: center;
}
.user-name {
  margin-left: 10px;
  line-height: 14px;
}
// .header-item {
//   margin-left: 20px;
// }
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  cursor: pointer;
}
.theme-btn {
  font-size: 14px;
  cursor: pointer;
  margin-right: 40px;
}
.loginout {
  font-size: 14px;
  cursor: pointer;
}
</style>
