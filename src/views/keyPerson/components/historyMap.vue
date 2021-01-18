<!--
 * @Author: your name
 * @Date: 2021-01-12 11:18:27
 * @LastEditTime: 2021-01-18 14:31:45
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
      LayerGroup: null,
      time1: null,
      time2: null,
      redIcon: null,
      startIcon: null,
      endIcon: null
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
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.Baidu
      })
      this.LayerGroup = new L.LayerGroup();
      L.tileLayer.baidu({ layer: 'custom', customid: 'googlelite' }).addTo(this.map);
      this.pointIcon = L.icon({iconUrl: '/img/poseon.png', iconSize: [20, 28],  iconAnchor: [10, 26], popupAnchor: [1, -38] });
      this.redIcon = L.icon({iconUrl: '/img/red.png', iconSize: [20, 28],  iconAnchor: [10, 26], popupAnchor: [1, -38] });
      this.startIcon = L.icon({iconUrl: '/img/start.png', iconSize: [40, 34],  iconAnchor: [11, 30], popupAnchor: [1, -38] });
      this.endIcon = L.icon({iconUrl: '/img/end.png', iconSize: [40, 34],  iconAnchor: [11, 30], popupAnchor: [1, -38] });
    },
    // 画点
    drawMapPoint() {
      if (this.LayerGroup !== null) {
        this.map.removeLayer(this.LayerGroup)
      }
      let layers = []
      let steView = []
      let iconStyle = null
      steView[0] = Number(this.data[0].lat)
      steView[1] = Number(this.data[0].lng)
      this.data.forEach((item, index) => {
        if (index === 0) {
          iconStyle = this.startIcon
        } else if (index === this.data.length - 1) {
          iconStyle = this.endIcon
        } else {
          iconStyle = this.pointIcon
        }
        let layer = new L.marker(new L.LatLng(item.lat, item.lng), {
          icon: iconStyle
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
      // 回放
      if (this.data.length) {
        let i = 0;
        this.time1 = setTimeout(() =>{
          this.resetMkPoint(i);
        },1000)
      }
    },
    // 画线
    drawMapLine() {
      let lines = []
      this.data.forEach(item => {
        lines.push([item.lat, item.lng])
      })
      this.polyLine = L.polyline(lines, { color: '#FF6A06',weight: 2 }).addTo(this.map);
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
    // 历史轨迹回放
    // playback() {
    //   if (this.LayerGroup !== null) {
    //     this.map.removeLayer(this.LayerGroup)
    //   }
    //   if (this.data.length) {
    //     let i = 0;
    //     this.time1 = setTimeout(() =>{
    //       console.log('i', i)
    //       this.resetMkPoint(i);
    //     },300)
    //   }
    // },
    resetMkPoint(i){
      let marker = null
      marker = new L.marker(new L.LatLng(this.data[i].lat, this.data[i].lng), {
        icon: this.redIcon
      }).addTo(this.map)
      if(i < this.data.length - 1){
        this.time2 = setTimeout(() => {
          i++;
          this.map.removeLayer(marker)
          this.resetMkPoint(i);
        },300);
      } else {
        this.map.removeLayer(marker)
      }
    }
  },
  watch: {
    data: {
      handler: function (val) {
        if (val !== null && val.length > 0) {
          clearTimeout(this.time1)
          clearTimeout(this.time2)
          this.drawMapPoint()
          this.drawMapLine()
        }
      },
      deep: true
    }
  },
  destroyed() {
    clearTimeout(this.time1)
    clearTimeout(this.time2)
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