<template>
  
  <div class="add_project">
    <!-- 增加百度地图 -->
    <baidu-map class="map" :zoom="zoom" @ready="handler" :center="center"></baidu-map>
    <!-- <baidu-map :center="center" :zoom="zoom" @ready="handler"></baidu-map> -->
  </div>
</template>

<script>
// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
export default {
  components: { },
  name: 'addProject',
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3
    }
  },
  created() {
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15
    }
  },
  mounted() {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.map {
  width: 100%;
  height: 500px;
}
</style>
