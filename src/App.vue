<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App'
  }
</script>
<style>
/* 图片查看器的z-index */
.pswp {
  z-index: 5000;
}
</style>
