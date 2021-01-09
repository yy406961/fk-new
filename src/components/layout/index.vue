<!--
 * @Author: your name
 * @Date: 2021-01-09 09:57:01
 * @LastEditTime: 2021-01-09 10:28:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\components\layout\index.vue
-->
<template>
  <div class="layout">
    <div class="header">头部</div>
    <div class="elContainer">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: "layout",
  components: {
  },
  data() {
    return {
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
    height: 50px;
    border: 1px solid #f00;
  }
  .elContainer {
    height: calc(100% - 50px);
    border: 1px solid #00f;
  }
}
</style>