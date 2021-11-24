<template>
  <div>
    <PageTitle v-if="titleText" :title-text="titleText">
      <slot name="options" />
    </PageTitle>
    <div class="top-slot" v-if="showTopSlot">
      <el-card class="box-card">
        <slot name="top-slot" />
      </el-card>
    </div>
    <div class="content-slot" v-if="showContentSlot">
      <el-card class="box-card">
        <slot />
      </el-card>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import PageTitle from './PageTitle.vue'

export default defineComponent({
  name: 'Skeleton',
  components: { PageTitle },
  props: {
    titleText: {
      type: String,
      default: ''
    },
    showTopSlot: {
      type: Boolean,
      default: true
    },
    showContentSlot: {
      type: Boolean,
      default: true
    }
  },
  setup(props, ctx) {
    return {
      props
    }
  }
})
</script>

<style lang="scss" scoped>
.top-slot{
  margin-bottom: 15px;
}
</style>
