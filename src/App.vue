<script setup>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import WebMap from './components/WebMap.vue'
import AsideTool from './components/AsideTool.vue'
import LayoutTool from './components/LayoutTool.vue'
import SearchBar from './components/SearchBar.vue'

</script>

<template>
  <SearchBar class="SearchBar" />
  <div class="main">
    <LayoutTool class="LayoutTool" />
    <!-- <AsideTool class="AsideTool" /> -->
  </div>
  <WebMap class="mapContent" />
</template>

<style>
/* @import '@/assets/css/all.css'; */
/* @import '@/assets/css/all.css'; */
/* @import styles from '@/assets/css/all.css' */
.main{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  padding: 20px;
  box-sizing: border-box;
}

.SearchBar{
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 220;
}
.LayoutTool {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 220;
}
.AsideTool{
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 220;
}

.mapContent {
  position: fixed;
  top: 0;
  left: 0px;
  z-index: 0;
  outline: none;
}
</style>
