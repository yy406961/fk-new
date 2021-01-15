<!--
 * @Author: your name
 * @Date: 2021-01-12 11:18:27
 * @LastEditTime: 2021-01-15 09:17:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\views\keyPerson\components\historyMap.vue
-->
<template>
  <div class="historyMap">
    <div :id="id" :style="mapStyle"></div>
  </div>
</template>


<script>
require("@/assets/js/tileLayer.baidu");
export default {
  name: "historyMap",
  props: {
    id: {
      type: String,
      default: 'map'
    },
    data: {
      type: Array
    },
  },
  data() {
    return {
      rightShow: false,
      map: null,
      pointIcon: null,
      LayerGroup: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap()
    })
  },
  methods: {
    //创建地图
    initMap() {
      this.map = L.map(this.id, {
        minZoom: 3,
        maxZoom: 18,
        center: [28.2120, 112.9980],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.Baidu
      })
      this.LayerGroup = new L.LayerGroup();
      L.tileLayer.baidu({ layer: 'custom', customid: 'googlelite' }).addTo(this.map);
      this.pointIcon = L.icon({iconUrl: '/img/poseon.png', iconSize: [20, 28],  iconAnchor: [10, 26], popupAnchor: [1, -38] });
    },
    // 画点
    drawMapPoint() {
      let layers = []
      let steView = []
      steView[0] = Number(this.data[0].lat)
      steView[1] = Number(this.data[0].lng)
      this.data.forEach(item => {
        let layer = new L.marker(new L.LatLng(item.lat, item.lng), {
          icon: this.pointIcon
        }).addTo(this.map)
        
        let mapPop = L.popup({ maxWidth: 1200 })
        layer.on("click", (e) => {
          let content = this.showLocInfo(item)
          mapPop.setLatLng(e.latlng).setContent(content).openOn(this.map);
        })
        layers.push(layer);
      })
      this.LayerGroup = L.layerGroup(layers);
      this.map.addLayer(this.LayerGroup);
      this.map.setView(steView)
    },
    // 画线
    drawMapLine() {
      let lines = []
      this.data.forEach(item => {
        lines.push([item.lat, item.lng])
      })
      this.polyLine = L.polyline(lines, { color: '#f00',weight: 2 }).addTo(this.map);
    },
    // 点的提示框内容
    showLocInfo (obj) {
      let xwtype = ''
      if (obj.type === '1') {
        xwtype = '信令'
      } else if (obj.type === '2') {
        xwtype = '通话'
      }
      var sContent = "";
      sContent += "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>点位信息</h4>";
      sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>行 为："+ xwtype + "</p>";
      sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>时 间："+ obj.duration + "</p>";
      sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>号码归属地："+ obj.homecode + "</p>";
      sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>基站信息："+ obj.wbname + "</p>";
      sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>经度："+ obj.lat + "         纬度:"+obj.lng+"</p>";
      return sContent;
    },
  },
   watch: {
    data: {
      handler: function (val) {
        if (val !== null && val.length > 0) {
          this.drawMapPoint()
          this.drawMapLine()
        }
      },
      deep: true
    }
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
.historyMap {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>