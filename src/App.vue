<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance  } from 'vue'
import $ from 'jquery'


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
            ],
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
                    switchControl.setAttribute('class', 'switchControl position-fixed start-50 translate-middle-x')
                    document.body.appendChild(switchControl)
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
        function showMapStatus() {
            proxy.$refs.mapCom.showLayers()
        }
        return {
            state,
            mapControl,
            layerControl,
            onChangeLayerList,
            showMapStatus
        }
    }
}
</script>

<template>
    <div class="position-fixed" style="z-index: 999;" @click="showMapStatus">123</div>
    <SearchBar class="SearchBar"
        :mapStatus="state.mapStatus"
        @onMoveTo="layerControl('moveTo', { xAxis: 121.00507828593254, yAxis: 24.754325687885284 })"
        @onMapMode="(value) => layerControl('mapMode', value)"
        @onChangeMapCount="(value) => layerControl('changeMapCount', value)"
        @onChangeDimensionMap="(value) => layerControl('changeDimensionMap', value)"
    />
    <div class="asideTool position-absolute top-50 translate-middle-y" id="asideTool">
        <div class="asideTool-btn order-1 mb-0" @click="mapControl('In')">
            <img src="./assets/img/icon/zoomIn.svg" alt="zoomIn">
        </div>
        <div class="asideTool-btn order-1 mb-2" @click="mapControl('Out')">
            <img src="./assets/img/icon/zoomOut.svg" alt="zoomOut">
        </div>
        <div class="asideTool-btn order-1 mb-2" @click="mapControl('toNorth')">
            <img src="./assets/img/icon/compass.svg" alt="compass">
        </div>
        <div class="asideTool-btn order-1 mb-2" @click="layerControl('moveTo')">
            <!-- location缺圖 -->
            <img src="./assets/img/icon/zoom.svg" alt="location">
        </div>
        <div class="asideTool-btn order-1 mb-2" @click="mapControl('fullScreen')">
            <img src="./assets/img/icon/zoom.svg" alt="zoom">
        </div>
    </div>
    <div class="main">
        <div v-if="state.isMapType === '2D'">
            <!-- <Wes ref="mapCom"
                :targetNum="state.targetNum" :layerList="state.layerList"
            /> -->
            <WebMap ref="mapCom"
                :targetNum="state.targetNum" :layerList="state.layerList"
            />
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
    left: 20px

.switchControl
    top: 10px
</style>
