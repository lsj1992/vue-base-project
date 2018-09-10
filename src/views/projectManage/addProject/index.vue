<template>
  
  <div class="add_project">
    <div>
      <!-- 增加百度地图 -->
      <baidu-map ref='baidu_map'
        class="map"
        :scroll-wheel-zoom="true"
        :zoom="zoom"
        @ready="handler" 
        :center="center">
        <!-- mapType="BMAP_NORMAL_MAP,BMAP_HYBRID_MAP" -->
      </baidu-map>
    </div>
  </div>
</template>

<script>
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
      const _this = this
      console.log(BMap, map)
      _this.center.lng = 116.404
      _this.center.lat = 39.915
      _this.zoom = 15
    }
  },
  mounted() {
  },
  destroyed() {
  }
}
</script>
<style>
.anchorBL {
  display:none;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.map {
  width: 100%;
  height: 500px;
}
</style>
