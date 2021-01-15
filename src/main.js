/*
 * @Author: your name
 * @Date: 2021-01-09 09:45:52
 * @LastEditTime: 2021-01-11 13:57:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import '@/assets/css/index.scss'

//引入leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; //引入离线地图样式
import 'leaflet-draw/dist/leaflet.draw.css';

// 引入 leaflet.markercluster
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import 'leaflet.markercluster/dist/leaflet.markercluster'

// 引入 leaflet.contextmenu
import "leaflet-contextmenu/dist/leaflet.contextmenu.css"
import 'leaflet-contextmenu/dist/leaflet.contextmenu'


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')