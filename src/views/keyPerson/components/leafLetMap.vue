<!--
 * @Author: your name
 * @Date: 2021-01-09 10:51:34
 * @LastEditTime: 2021-01-15 14:48:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\views\keyPerson\components\leafLetMap.vue
-->
<template>
  <div class="leafLetMap">
    <!-- 地图 -->
    <div :id="id" :style="mapStyle"></div>
    <!-- 右键菜单 -->
    <div class="rightMenu" v-if="rightShow">
      <div class="rightItem" @click="showhistory">
        <img src="@/assets/img/keyPerson/history.png" alt="">
        <span>历史轨迹</span>
      </div>
      <div class="rightItem" @click="showApp">
        <img src="@/assets/img/keyPerson/app.png" alt="">
        <span>APP日志</span>
      </div>
      <div class="rightItem" @click="showInternet">
        <img src="@/assets/img/keyPerson/internet.png" alt="">
        <span>上网日志</span>
      </div>
    </div>
    <!-- 颜色对照表 -->
    <div class="colorTable">
      <div class="title">颜色对照表</div>
      <i @click="switchCard" class="switchCard el-icon-arrow-down"></i>
      <div v-if="colorShow">
        <div class="colorItem"><img src="@/assets/img/keyPerson/shilian.png" alt="">失联号码</div>
        <div class="colorItem"><img src="@/assets/img/keyPerson/faxian.png" alt="">在网号码，今日发现信令</div>
        <div class="colorItem"><img src="@/assets/img/keyPerson/weifaxian.png" alt="">在网号码，今日未发现信令</div>
        <div class="colorItem"><img src="@/assets/img/keyPerson/sanri.png" alt="">在网号码，近三日未发现信令</div>
      </div>
    </div>
  </div>
</template>

<script>
require("@/assets/js/tileLayer.baidu");
import mockData from './data'
export default {
  name: "leafLetMap",
  props: {
    id: {
      type: String,
      default: 'map'
    },
    mapData: {
      type: Array
    },
  },
  data() {
    return {
      rightShow: false,
      colorShow: true,
      map: null,
      polyLine: new L.LayerGroup(),
      pointIcon: null,
      shilian: null,
      faxian: null,
      sanri: null,
      weifaxian: null,
      checkPhone: '',
      markers: null
    }
  },
  watch: {
    mapData: {
      handler: function (val) {
        if (val !== null && val.length > 0) {
          this.setPointGroup()
        }
      },
      deep: true
    }
  },
  created() {
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
      L.tileLayer.baidu({ layer: 'custom', customid: 'googlelite' }).addTo(this.map);
      // 0 失联号码
      this.shilian = L.icon({iconUrl: '/img/shilian.png', iconSize: [18, 26],  iconAnchor: [9, 32], popupAnchor: [1, -38] });
      // 1 在网号码，今日发现信令
      this.faxian = L.icon({iconUrl: '/img/faxian.png', iconSize: [18, 26],  iconAnchor: [9, 32], popupAnchor: [1, -38] });
      // 2 在网号码，今日未发现信令
      this.weifaxian = L.icon({iconUrl: '/img/weifaxian.png', iconSize: [18, 26],  iconAnchor: [9, 32], popupAnchor: [1, -38] });
      // 3 在网号码，近三日未发现信令
      this.sanri = L.icon({iconUrl: '/img/sanri.png', iconSize: [18, 26],  iconAnchor: [9, 32], popupAnchor: [1, -38] });
    },
    // 点聚合
    setPointGroup() {
      if (this.markers !== null) {
        this.map.removeLayer(this.markers)
      }
      this.markers = new L.markerClusterGroup();
      this.mapData.forEach(item => {
        // 0 失联号码
        // 1 在网号码，今日发现信令
        // 2 在网号码，今日未发现信令
        // 3 在网号码，近三日未发现信令
        if (item.statusflag === '0') {
          this.pointIcon = this.shilian
        } else if (item.statusflag == '1') {
          this.pointIcon = this.faxian
        } else if (item.statusflag === '2') {
          this.pointIcon = this.weifaxian
        } else if (item.statusflag === '3') {
          this.pointIcon = this.sanri
        } else {
          this.pointIcon = this.shilian
        }
        let marker = L.marker(new L.LatLng(item.lastlat, item.lastlang), {
          icon: this.pointIcon
        })
        // 给marker添加各自的telphone
        marker.telphone = item.telphone
        // 给marker添加一个点击提示框
        marker.bindPopup(this.showLocInfo(item))
        this.markers.addLayer(marker)
      })
      this.map.addLayer(this.markers);
      this.markers.on('contextmenu', a => { 
        this.rightShow = true
        this.checkPhone = a.sourceTarget.telphone
        this.$emit('checkPhone', this.checkPhone)
        this.$nextTick(() => {
          $('.rightMenu').css('left', a.layerPoint.x + 'px')
          $('.rightMenu').css('top', a.layerPoint.y + 'px')
        })
      })
      // 如果只有一个点，调整地图视角
      if (this.mapData.length === 1) {
        let steView = []
        steView[0] = Number(this.mapData[0].lastlat)
        steView[1] = Number(this.mapData[0].lastlang)
        this.map.setView(steView)
      } else {
        this.map.setView([28.2120, 112.9980])
      }
    },
    // 点的提示框内容
    showLocInfo (obj) {
        var sContent = "";
        sContent += "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>点位信息</h4>";
        sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>姓    名："+ obj.xm + "</p>";
        sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>手机号："+ obj.telphone + "</p>";
        sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>采集地："+ obj.lastaddr + "</p>";
        sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>采集时间："+ obj.lasttime + "</p>";
        sContent += "<p style='margin:0 0 5px 0;padding:0.2em 0'>经度："+ obj.lastlat + "         纬度:"+obj.lastlang+"</p>";
        return sContent;
    },
    // 单个点的历史轨迹
    showhistory() {
      this.rightShow = false
      this.$emit('showHistory', true, 0)
    },
    // 单个点的APP日志
    showApp() {
      this.rightShow = false
      this.$emit('showHistory', true, 1)
    },
    // 单个点的上网日志
    showInternet() {
      this.rightShow = false
      this.$emit('showHistory', true, 2)
    },
    // 颜色对照表显示隐藏
    switchCard() {
      this.colorShow = !this.colorShow
      if (this.colorShow) {
        $('.switchCard').removeClass('el-icon-arrow-up')
        $('.switchCard').addClass('el-icon-arrow-down')
      } else {
        $('.switchCard').removeClass('el-icon-arrow-down')
        $('.switchCard').addClass('el-icon-arrow-up')
      }
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
.leafLetMap {
  width: 100%;
  height: 100%;
  position: relative;
  .rightMenu {
    z-index: 1000;
    position: absolute;
    background: rgba(9, 25, 61, 0.8);
    border-radius: 3px;
    padding: 5px;
    top: 0;
    left: 0;
    color: #fff;
    .rightItem {
      display: flex;
      align-items: center;
      width: 100px;
      line-height: 25px;
      cursor: pointer;
      &:hover {
        color: #06AAE9;
        background: rgba(6, 170 , 233, 0.3);
      }
      img {
        height: 21px;
        width: 21px;
      }
      span {
        font-size: 13px;
        margin-left: 5px;
      }
    }
  }
  .colorTable {
    z-index: 1000;
    position: absolute;
    right: 0;
    bottom: 0;
    background: #E7F0F4;
    border: 1px solid #B7B7B7;
    padding: 8px 10px;
    .title {
      margin-right: 20px;
    }
    .switchCard {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
    }
    .colorItem {
      display: flex;
      align-items: center;
      font-size: 13px;
      line-height: 28px;
      img {
        margin-right: 5px;
        width: 15px;
      }
    }
  }
}
</style>