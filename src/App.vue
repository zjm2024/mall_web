<template>
  <!-- 这里只需要放 router-view，不应该有其他内容 -->
  <router-view />
</template>

<script setup>
// App.vue 应该只作为路由的容器
</script>

<style>
/* 全局样式可以放在这里 */
#app {
  height: 100vh;
  overflow: hidden;
}

body {
  margin: 0;
  padding: 0;
}
</style>