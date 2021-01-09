<!--
 * @Author: your name
 * @Date: 2021-01-09 09:57:01
 * @LastEditTime: 2021-01-09 09:57:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\components\layout\index.vue
-->
<template>
  <div class="layout">
    <div>头部</div>
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
}
</style>