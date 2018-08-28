<template>
  <div id="app">
    <keep-alive>
      <router-view v-if='$route.meta.keepAlive'></router-view>
    </keep-alive>
    <router-view v-if='!$route.meta.keepAlive'></router-view>
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
