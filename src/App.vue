<script setup>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import WebMap from './components/WebMap.vue'
import AsideTool from './components/AsideTool.vue'
import LayoutTool from './components/LayoutTool.vue'
import SearchBar from './components/SearchBar.vue'

</script>

<template>
  <div class="main">
  </div>
    <SearchBar class="SearchBar" />
    <LayoutTool class="LayoutTool" />
  <AsideTool class="AsideTool" />
  <WebMap class="mapContent" />
</template>

<style>
/* @import '@/assets/css/all.css'; */
/* @import '@/assets/css/all.css'; */
/* @import styles from '@/assets/css/all.css' */

.SearchBar{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 220;
}
.LayoutTool {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 220;
}
.AsideTool{
  position: fixed;
  top: 0;
  right: 0;
  z-index: 220;
}

.mapContent {
  position: fixed;
  top: 0;
  left: 0px;
  outline: none;
}
</style>
