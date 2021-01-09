<!--
 * @Author: your name
 * @Date: 2021-01-09 09:35:01
 * @LastEditTime: 2021-01-09 10:58:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\views\keyPerson\index.vue
-->
<template>
  <div class="keyPerson">
    <mapCom id="map"></mapCom>
  </div>
</template>

<script>
export default {
  name: "keyPerson",
  data() {
    return {}
  },
  components: {
    // mapCom: () => import('./components/mapOld')
    mapCom: () => import('./components/baiduMap')
  }
}
</script>

<style scoped lang="scss">
.keyPerson {
  height: 100%;
  background: rgba(3,79,131,0.24);
}
</style>