<!--
 * @Author: your name
 * @Date: 2021-01-09 10:56:40
 * @LastEditTime: 2021-01-09 11:07:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\views\keyPerson\components\baiduMap.vue
-->
<template>
  <div class="baiduMap">
    <div :id="id" :style="mapStyle"></div>
  </div>
</template>

<script>
// import BMapLib from 'BMapLib'
export default {
  name: "baiduMap",
  props: {
    id: {
      type: String,
      default: 'map'
    },
  },
  data() {
    return {}
  },
  mounted() {
    this.createMap()
  },
  methods: {
    //创建地图
    createMap() {
      this.map = new BMap.Map(this.id, { minZoom: 3, maxZoom: 18 })
      // 清除所有覆盖物
      this.map.clearOverlays()
      // 找中心点坐标
      const poi = new BMap.Point(112.96843, 28.198195)
      this.map.centerAndZoom(poi, 14)
      this.map.enableScrollWheelZoom()
    },
  },
  computed: {
    mapStyle() {
      return {
        width: '100%',
        height: '100%'
      }
    },
  },
}
</script>

<style scoped lang="scss">
.baiduMap {
  width: 100%;
  height: 100%;
}
</style>