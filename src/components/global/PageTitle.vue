<template>
  <div class="title-box">
    <div class="title-text">
      {{ titleText }}
    </div>
    <div class="option-slot">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageTitle',
  props: {
    titleText: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return {
      props
    }
  }
})
</script>

<style lang="scss" scoped>
.title-box{
  display: flex;
  align-items: center;
  min-height: 40px;
  margin-bottom: 10px;
  padding: 0 5px 0 10px;
}
.title-text{
  flex: 1;
  font-size: 18px;
  color: $mainColor;
}
.option-slot{
  text-align: right;
  overflow: hidden;
}
</style>
