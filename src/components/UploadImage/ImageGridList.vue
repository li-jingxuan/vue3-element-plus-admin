<template>
<div class="image-list">
  <div class="image-item" v-for="(img, index) in imgList" :key="img.key" v-loading="img.reqState === 1">
    <div class="inner">
      <img :src="img.imgUrl" alt="">
    </div>
    <div class="set-main-image" @click="handleCmdClick('setMain', img, index)">设为主图</div>
    <div class="del" @click="handleCmdClick('del', img, index)"><i class="el-icon-close"></i></div>
    <div class="error-tips" v-show="img.reqState === 3">
      {{ img.reqErrMsg }}
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    imgList: {
      type: Array,
      default: () => []
    }
  },
  emits: ['del', 'setMain'],
  setup(props, ctx) {
    const handleCmdClick = (cmd, item, index) => {
      switch (cmd) {
        case 'del':
          ctx.emit('del', item, index)
          break
        case 'setMain':
          ctx.emit('setMain', item, index)
          break
      }
    }
    return {
      props,
      handleCmdClick
    }
  }
}
</script>

<style lang="scss" scoped>
.image-list{
  display: flex;
  flex-wrap: wrap;
  .image-item{
    width: 200px;
    height: 0;
    padding-bottom: 200px;
    position: relative;
    &:hover{
      .set-main-image{ opacity: 1; }
      .del{ opacity: 1; }
    }
    .inner{
      position: absolute;
      top: 8px;
      right: 8px;
      bottom: 8px;
      left: 8px;
      img{
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .hover-show-base{
      opacity: 0;
      transition: opacity .3s;
      position: absolute;
      background-color: rgba(0,0,0,.3);
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
    .set-main-image{
      height: 40px;
      bottom: 0;
      left: 0;
      right: 0;
      line-height: 40px;
      @extend .hover-show-base
    }
    .del{
      top: 10px;
      right: 10px;
      z-index: 9999;
      border-radius: 50%;
      height: 22px;
      line-height: 22px;
      width: 22px;

      @extend .hover-show-base
    }
    .error-tips{
      @extend .hover-show-base;
      text-align: center;
      top: 0;
      z-index: 9999;
      color: #f56c6c;
    }
  }
}
</style>
