<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

import WebMap from './components/WebMap.vue'
import Wes from './components/Wes.vue'
import LayoutTool from './components/LayoutTool.vue'
import SearchBar from './components/SearchBar.vue'

export default {
  setup(props, { emit }){
    const state=reactive({
    })
    const name = ref()
    return {
      state,
    }
  }
}

</script>

<template>
    <SearchBar class="SearchBar" />
    <div class="main">
        <LayoutTool class="LayoutTool" />
    </div>

    <WebMap class="mapContent" />
    <!-- <Wes class="mapContent" /> -->
</template>

<style lang="sass">
.mapContent
    height: 100vh
    width: 100vw
.main
    position: fixed
    top: 36px
    left: 36px
    z-index: 10
    padding: 20px
    box-sizing: border-box


.SearchBar
    position: absolute
    top: 20px
    left: 20px
    z-index: 220


.LayoutTool
    position: absolute
    top: 0
    left: 0
    z-index: 220
</style>
