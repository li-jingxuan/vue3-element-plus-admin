<template>
  <div class="dashboard">
    <div class="welcome-box">
      <div class="img-box"></div>
      <div class="txt">Welcome</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  methods: {
    aaa() {
      let a = '2'
      if (a === 2) {
        a = 1
        console.log(22222)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  height: 100%;
  color: rgb(185, 185, 185);
  font-size: 60px;
  letter-spacing: 10px;
  text-align: center;
  .welcome-box {
    display: inline-block;
    .img-box {
      width: 491px;
      height: 491px;
      background-image: url(~@/assets/img/home/home-welcome.png);
      background-size: 100% 100%;
    }
    .txt {
      font-size: 32px;
    }
  }
}
</style>
