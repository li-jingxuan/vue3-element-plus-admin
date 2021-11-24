<template>
<div class="detail-content-wrapper">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane
      v-for="item in previewDetails"
      :key="item.lang"
      :label="item.langText"
    >
      <div class="detail-preview-inner">
        <div
          class="detail-item"
          v-for="(el, idx) in item.items"
          :key="idx"
        >
          <p v-html="el.content" v-if="el.type === 'text'"></p>
          <p v-if="el.type === 'image'" :data-url="el.content">
            <img class="product-image-item" :src="el.content" alt="">
          </p>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import { ref, watchEffect, computed, unref } from 'vue'

export default {
  name: 'ProductDetail',
  props: {
    details: {
      type: Array,
      required: true
    },
    languages: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const activeName = ref('')
    const handleClick = () => {}
    watchEffect(() => {
      console.log('watch', props.details)
    })

    const previewDetails = computed(() => {
      const _copyDetail = JSON.parse(JSON.stringify(unref(props.details)))
      _copyDetail.forEach(c => {
        const _l = unref(props.languages).filter(v => v.code === c.lang)[0]
        c.langText = _l ? _l.aliasName : c.lang
      })

      return _copyDetail
    })
    return {
      props,
      previewDetails,
      activeName,
      handleClick
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-content-wrapper{
  max-width: 970px;
}
.detail-preview-inner{
  max-height: 600px;
  overflow-y: auto;
}
.product-image-item{
  width: auto;
  object-fit: contain;
}
</style>
