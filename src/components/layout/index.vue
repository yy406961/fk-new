<!--
 * @Author: your name
 * @Date: 2021-01-09 09:57:01
 * @LastEditTime: 2021-01-15 10:46:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\components\layout\index.vue
-->
<template>
  <div class="layout">
    <div class="header">
      <div class="logo">
        <gTime class="gTime"></gTime>
        <img src="@/assets/img/head/logo.png" alt="">
        <!-- <div class="userInfo">
          <img src="@/assets/img/head/person.png" alt="">
          <span>{{ userName }}</span>
          <i class="line"></i>
          <img src="@/assets/img/head/change.png" alt="">
          <img src="@/assets/img/head/exit.png" alt="">
        </div> -->
      </div>
    </div>
    <div class="elContainer">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: "layout",
  components: {
    gTime: () => import('./gTime')
  },
  data() {
    return {
      userName: '张三'
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  },
  watch: {
  },
  destroyed () {
  }
}
</script>

<style scoped lang="scss">
.layout {
  height: 100%;
  .header {
    height: 55px;
    background: #001733;
    .logo {
      height: 46px;
      background: url("~@/assets/img/head/headBg.png") no-repeat center;
      background-size: 100% 100%;
      padding-top: 6px;
      position: relative;
      img {
        margin: 0 auto;
        display: flex;
        height: 30px;
      }
      .gTime {
        color: #4EDBFF;
        position: absolute;
        bottom: 0;
        left: 10px;
      }
      .userInfo {
        position: absolute;
        bottom: -5px;
        right: 0;
        color: #fff;
        display: flex;
        align-items: center;
        font-size: 14px;
        background: url("~@/assets/img/head/bg.png") no-repeat center;
        background-size: 100% 100%;
        padding: 5px 3px 5px 12px;
        img {
          width: 22px;
          height: 22px;
          margin: 0 5px;
          cursor: pointer;
        }
      }
    }
  }
  .elContainer {
    height: calc(100% - 55px);
  }
}
</style>