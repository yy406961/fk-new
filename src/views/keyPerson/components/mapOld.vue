<!--
 * @Author: your name
 * @Date: 2021-01-09 10:51:34
 * @LastEditTime: 2021-01-09 10:55:23
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\views\keyPerson\components\mapOld.vue
-->
<template>
  <div :id="id" :style="mapStyle"></div>
</template>

<script>

require("@/assets/js/tileLayer.baidu");
export default {
  name: "areaMap",
  props: {
    id: {
      type: String,
      default: 'map'
    },
    data: {
      type: Object,
      default: () => {
        return null
      }
    },
  },
  data() {
    return {
      map: null,
      polyLine: new L.LayerGroup(),
    }
  },
  created() {
    this.$nextTick(() => {
      // this.$set(this.data)
      this.initMap()
    })
  },
  methods: {
    //创建地图
    initMap() {
      console.log('aaaaaaa', this.id)
      this.map = L.map(this.id, {
        minZoom: 1,
        maxZoom: 18,
        center: [28.198195, 112.96843],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.Baidu,
      })
      // this.LayerGroup = new L.LayerGroup();
      L.tileLayer.baidu({ layer: 'custom', customid: 'googlelite' }).addTo(this.map);
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