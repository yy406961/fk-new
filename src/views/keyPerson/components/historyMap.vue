<!--
 * @Author: your name
 * @Date: 2021-01-12 11:18:27
 * @LastEditTime: 2021-01-19 11:09:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\views\keyPerson\components\historyMap.vue
-->
<template>
  <div class="historyMap">
    <div :id="id" :style="mapStyle"></div>
    <div class="btnPart">
      <el-button type="primary" @click="playBack" size="mini">{{ play }}</el-button>
      <el-button type="primary" @click="stopPlay" size="mini" :disabled="stopDisabled">{{ stop }}</el-button>
      <span class="timeLine">
        <span class="acitveTime"></span>
      </span>
    </div>
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
      // time1: null,
      time2: null,
      redIcon: null,
      startIcon: null,
      endIcon: null,
      activeIndex: 0,
      stop: '暂停',
      stopDisabled: true,
      play: '回放'
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
      sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>基站信息："+ obj.uli + "</p>";
      sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>经度："+ obj.lat + "         纬度:"+obj.lng+"</p>";
      return sContent;
    },
    // 历史轨迹回放 停止
    playBack() {
      if (this.data.length) {
        if (this.play === '回放') {
          this.stopDisabled = false
          if (this.LayerGroup !== null) {
            this.map.removeLayer(this.LayerGroup)
          }
          if (this.polyLine !== null) {
            this.map.removeLayer(this.polyLine)
          }
          this.resetMkPoint(0)
          this.play = '停止'
        } else {
          clearTimeout(this.time2)
          this.stopDisabled = true
          this.activeIndex = 0
          $('.acitveTime').css('width', '100%')
          if (this.LayerGroup !== null) {
            this.map.removeLayer(this.LayerGroup)
          }
          if (this.polyLine !== null) {
            this.map.removeLayer(this.polyLine)
          }
          this.drawMapPoint()
          this.drawMapLine()
          this.play = '回放'
        }
      }
    },
    // 暂停 继续回放
    stopPlay() {
      if (this.stop === '暂停') {
        clearTimeout(this.time2)
        this.stop = '继续'
      } else {
        if (this.LayerGroup !== null) {
          this.map.removeLayer(this.LayerGroup)
        }
        if (this.polyLine !== null) {
          this.map.removeLayer(this.polyLine)
        }
        this.resetMkPoint(this.activeIndex)
        this.stop = '暂停'
      }
    },
    resetMkPoint(i){
      this.activeIndex = i
      $('.acitveTime').css('width', (i / (this.data.length - 1)) * 100 + '%')
      let markerGroup = null
      let polyLine = null
      let markers = []
      let iconStyle = null
      let lines = []
      for(let a = 0; a <= i ; a++) {
        // 画点
        if (a === 0) {
          iconStyle = this.startIcon
        } else if (a === this.data.length - 1) {
          iconStyle = this.endIcon
        } else if (a === i) {
          iconStyle = this.redIcon
        } else {
          iconStyle = this.pointIcon
        }
        let marker = new L.marker(new L.LatLng(this.data[a].lat, this.data[a].lng), {
          icon: iconStyle
        }).addTo(this.map)
        let mapPop = L.popup({ maxWidth: 1200 })
        marker.on("click", (e) => {
          let content = this.showLocInfo(this.data[a])
          mapPop.setLatLng(e.latlng).setContent(content).openOn(this.map);
        })
        markers.push(marker)

        // 画线
        lines.push([this.data[a].lat, this.data[a].lng])
      }
      this.LayerGroup = L.layerGroup(markers)
      this.map.addLayer(this.LayerGroup)

      this.polyLine = L.polyline(lines, { color: '#FF6A06',weight: 2 }).addTo(this.map)

      if(i < this.data.length - 1){
        this.time2 = setTimeout(() => {
          i++;
          this.map.removeLayer(this.LayerGroup)
          this.map.removeLayer(this.polyLine)
          this.resetMkPoint(i);
        }, 500);
      } else {
        this.map.removeLayer(this.LayerGroup)
        this.map.removeLayer(this.polyLine)
        this.activeIndex = 0
        clearTimeout(this.time2)
        this.drawMapPoint()
        this.drawMapLine()
        this.stop = '暂停'
        this.stopDisabled = true
        this.play = '回放'
      }
    }
  },
  watch: {
    data: {
      handler: function (val) {
        if (val !== null && val.length > 0) {
          clearTimeout(this.time2)
          this.drawMapPoint()
          this.drawMapLine()
        }
      },
      deep: true
    }
  },
  destroyed() {
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
  .btnPart {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 2001;
    width: calc(100% - 20px);
    .timeLine {
      background: #aaa;
      display: inline-block;
      width: calc(100% - 160px);
      height: 10px;
      margin-left: 10px;
      border-radius: 5px;
      position: relative;
      .acitveTime { 
        background: #66b1ff;
        position: absolute;
        width: 100%;
        height: 10px;
        border-radius: 5px;
        transition: width 0.3s;
      }
    }
  }
}
</style>