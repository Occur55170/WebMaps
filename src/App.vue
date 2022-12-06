<script setup>
import WebMap from './components/WebMap.vue'
// import searchBar from './components/searchBar.vue'
import Tool from './components/Tool.vue'

  const state = {
    pickedContract: '123'
  }
</script>

<template>
  <div class="main">
    <Tool />
  </div>
  <WebMap class="mapContent" />
</template>

<style scoped>
.main{
  position: fixed;
  z-index: 220;
}
.mapContent{
  position: fixed;
  top: 0;
  left: 0px;
  outline: none;
}
</style>
