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
        WebMap,
        // Wes
    },
    setup(props, { emit }) {
        const state = reactive({
            count: 1,
            math: 0,
        })
        const onChangeLayoutMath = function (value) {
            if (state.count !== value) {
                state.count = value
            }
            // nextTick(()=>{
            //     window.$refs.wen.gogo()
            // })
        }

        return {
            state,
            onChangeLayoutMath,
        }
    }
}

</script>

<template>
    <!-- <SearchBar class="SearchBar" @layouts="onChangeLayoutMath" /> -->
    <SearchBar class="SearchBar" @layouts="(value)=>{
        this.$refs.map.changeLayout(value)
    }" />
    <div class="main">
        <LayoutTool class="LayoutTool" />
    </div>

    <!-- <opp /> -->
    <div class="mapContent">
        <WebMap ref="map" id="qqq" />
        <!-- <Wes :count="state.count" /> -->
    </div>
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
