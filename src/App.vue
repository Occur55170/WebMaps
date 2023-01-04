<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'

import $ from 'jquery'

import WebMap from './components/WebMap.vue'
import Wes from './components/Wes.vue'
import LayoutTool from './components/LayoutTool.vue'
import SearchBar from './components/SearchBar.vue'

import opp from './components/opp.vue'


export default {
    components: {
        Wes
    },
  setup(props, { emit }){
    const state=reactive({
        count:1,
    })
    const doSomething = function() {
      // 在此處執行所需的操作
      console.log(this)
    }
    const changeLayouts = function(value){
        if(state.count !== value){
            state.count = value
        }
        // this.$refs.wes.gogo('123')
            // add
            // rm
    }
    return {
      state,
      changeLayouts
    }
  }
}

</script>

<template>
    <SearchBar class="SearchBar" @Layouts="changeLayouts" />
    <div class="main">
        <LayoutTool class="LayoutTool" />
    </div>

    <!-- <WebMap /> -->
    <!-- <opp /> -->
    <div class="mapContent">
        <Wes :yyds="doSomething()" />
    </div>
    <!-- <button style="position:fixed;top: 0;left: 50%; z-index:99999;" @click="changeLayouts">123</button> -->
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
