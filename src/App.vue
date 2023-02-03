<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance  } from 'vue'
import $ from 'jquery'

// import WebMap from './components/WebMap.vue'
// import Wes from './components/Wes.vue'
// import LayoutTool from './components/LayoutTool.vue'
// import SearchBar from './components/SearchBar.vue'

// import opp from './components/opp.vue'
// import threeDimensionMap from './components/threeDimensionMap.vue'

import createSwitch, { deleteSwitch } from 'switch-button'

//
import { TileArcGISRest } from 'ol/source.js'

export default {
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const state = reactive({
            targetNum: 1,
            isMapType: '2D',
            mapStatus: [],
            layerList: [
                {
                    name:'acerica',
                    layerData: new TileArcGISRest({
                        url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/' + 'USA/MapServer',
                    }),
                }
            ]
        })

        function mapControl(action, value) {
            proxy.$refs.mapCom.mapControl(action, value)
        }
        function layerControl(action, value) {
            if(action === 'changeMapCount'){
                if (value == 1 && document.getElementById('switchControl')) {
                    state.targetNum = 1
                    document.getElementById('switchControl').remove()
                }
                if (value == 2 && !(document.getElementById('switchControl'))) {
                    const switchControl = document.createElement('button')
                    switchControl.setAttribute('id', 'switchControl')
                    switchControl.setAttribute('class', 'order-0')
                    document.getElementById('asideTool').appendChild(switchControl)
                    const switchBtn = createSwitch(switchControl, {
                        text: ['左', '右'],
                        onChange: (checked) => {
                            state.targetNum = Number(!checked ? 1 : 2)
                        },
                    })
                }
            }
            proxy.$refs.mapCom.layerControl(action, value)
        }
        function onChangeLayerList(layerData) {
            const { name } = layerData
            let target = state.mapStatus.findIndex(node=>node.name == name && node.targetNum == state.targetNum)
            if(target !== -1){
                layerData.targetNum = state.targetNum
                state.mapStatus[target] = layerData
            } else {
                layerData.targetNum = state.targetNum
                state.mapStatus.push(layerData)
            }
        }
        function test({name, uid, action}) {
            console.log(1, name)
            console.log(2, uid)
            console.log(3, action)
        }
        return {
            state,
            mapControl,
            layerControl,
            onChangeLayerList,
            test,
        }
    }
}
</script>

<template>
    <SearchBar class="SearchBar"
        :mapStatus="state.mapStatus"
        @onMoveTo="layerControl('moveTo', { xAxis: -96.794027, yAxis: 31.624217 })"
        @onMapMode="(value) => layerControl('mapMode', value)"
        @onChangeMapCount="(value) => layerControl('changeMapCount', value)"
        @onChangeDimensionMap="(value) => layerControl('changeDimensionMap', value)"
    />
    <div class="asideTool position-absolute top-50 end-0 translate-middle-y" id="asideTool"
    :class="{
        // 'top-50 end-0 translate-middle-y': asideToolPosition,
        // 'd-flex flex-nowrap top-0 start-50 translate-middle-x align-items-center': !asideToolPosition,
    }">
        <div class="asideTool-btn order-1" @click="mapControl('fullScreen')">全螢幕</div>
        <div class="asideTool-btn order-1" @click="layerControl('moveTo')">定位</div>
        <div class="asideTool-btn order-1" @click="mapControl('In')">放大</div>
        <div class="asideTool-btn order-1" @click="mapControl('Out')">縮小</div>
    </div>

    <div class="main">
        <p>地圖一狀態: {{ state.mapStatus }} 地圖二狀態:</p>
        <div v-if="state.isMapType === '2D'">
            <Wes ref="mapCom"
                :targetNum="state.targetNum" :layerList="state.layerList"
                @onChangeLayerList="(layerData)=>{onChangeLayerList(layerData)}"
            />
            <!-- @onChangeLayerList="({name, uid, action})=>{onChangeLayerList({name, uid, action})}" -->
            <!-- <WebMap ref="mapCom"  :targetNum="targetNum" /> -->
        </div>
        <div v-if="state.isMapType === '3D'">
            <threeDimensionMap />
        </div>
    </div>

    <!-- <opp /> -->
</template>

<style lang="sass">
@import './assets/styles/all.module.scss'

.mapContent
    height: 100vh
    width: 100vw
.main
    position: fixed
    top: 0
    left: 0
    height: 100%
    width: 100%

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
.asideTool
    z-index: 220
</style>
