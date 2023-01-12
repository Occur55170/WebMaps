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
        Wes
    },
    setup(props, { emit }) {
        const state = reactive({
            count: 1,
            math: 0,
            targetMap: 1,
            aMap: true,
            bMap: false,
        })

        const abMap = function (e){
            emit('mapMode', e.target.checked)
            if(e.target.checked){
                state.aMap= true
            } else {
                state.aMap= false
            }
        }
        onMounted(()=>{
        })
        return {
            state,
            abMap
        }
    }
}

</script>

<template>
    <div style="position:fixed;right:0;z-index: 999;background: #fff;padding: 20px;">
        <div>
            <input type="checkbox" name="example" id="example" v-model="state.aMap" :value="false">
            <label for="example">切換(僅可切換一次)</label>
        </div>
    </div>
    <SearchBar class="SearchBar"
        @moveTo="(value)=>{
            this.$refs.map.moveTo(value)
        }"
        @mapMode="(value)=>{
            this.$refs.map.addLayout(value)
        }"
        @layouts="(action)=>{
            this.$refs.map.changeMapCount(action)
        }"
    />
    <div class="main">
        <LayoutTool class="LayoutTool" />
    </div>

    <!-- <opp /> -->
    <div class="mapContent">
        <div v-if="state.aMap"><WebMap ref="map" /></div>
        <div v-if="!state.aMap"><Wes ref="map" /></div>
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
