<template>
  <span>
    <i v-if="type === 'icon'" :class="className" :style="style"></i>
    <svg v-else class="svg" aria-hidden="true" :style="style">
      <use :xlink:href="`#${name}`"></use>
    </svg>
  </span>
</template>

<script>
import { reactive, computed } from 'vue'
import '@/assets/css/fonts/iconfont.js'
export default {
  name: 'SxIcon',
  props: {
    // iconfont的icon名, 如iconeye_open
    name: String,
    // 使用svg图标时传type="svg"
    type: {
      type: String,
      default: 'icon',
      validator: (value) => {
        // 传入的必须是指定范围的值
        return ['icon', 'svg'].includes(value)
      }
    },
    size: [String, Number],
    color: String,
    // 方便ElementUI等其他类icon的使用，接收icon的class名，如custom="el-icon-user"，传入此值后，name参数将失效。
    custom: String,
    // 为true时，鼠标经过光标设为小手
    pointer: Boolean,
    // 左外边距, 例 margin-l="8" 或 :margin-l="8"
    marginL: [String, Number],
    // 右外边距
    marginR: [String, Number]
  },
  setup(props) {
    const style = reactive({
      color: props.color,
      fontSize: `${props.size}px`,
      cursor: props.pointer ? 'pointer' : 'initial',
      marginLeft: `${props.marginL}px`,
      marginRight: `${props.marginR}px`
    })

    const className = computed(() => {
      if (props.custom) {
        return [props.custom]
      }
      return ['iconfont', `icon${props.name}`]
    })

    return {
      // data
      style,
      // computed
      className
    }
  }
}
</script>
<style lang="scss" scoped>
.svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
