<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance  } from 'vue'
import $ from 'jquery'


//
import { TileArcGISRest } from 'ol/source.js'

export default {
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const state = reactive({
            selectFeature: '',
            toolSwitch: {
                threeDimensionalBtn: false,
                layerConditionBtn: false,
                splitWindowBtn: false,
            },
            switchControl: false,
            dimensionMapStatus: '2D',
            targetNum: 1,
            mapStatus: [],
        })

        function toolSwitch(target) {
            state.selectFeature = target
        }
        function onChangeDimensionMap(value) {
            state.dimensionMapStatus = value
            layerControl('changeDimensionMap', value)
        }
        function onChangeMapCount(value) {
            layerControl('changeMapCount', value)
        }
        function onMoveTo() {
            layerControl('moveTo', { xAxis: -98.144457,  yAxis: 26.178938 })
        }
        function onExampleChange(e) {
            let value = {
                checked: e.target.checked,
                layersName: 'america',
            }
            layerControl('mapMode', value)
        }
        function mapControl(action, value) {
            proxy.$refs.mapCom.mapControl(action, value)
        }
        function layerControl(action, value) {
            if(action === 'changeMapCount'){
                if (value == 1 && document.getElementById('switchControl')) {
                    state.targetNum = 1
                    state.switchControl = false
                    // $('.currentMap').removeClass('currentMap')
                }
                if (value == 2 && !(document.getElementById('switchControl'))) {
                    state.switchControl = true
                    // $('.map1').addClass('currentMap')
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
            toolSwitch,
            onChangeDimensionMap,
            onChangeMapCount,
            onMoveTo,
            onExampleChange,
            mapControl,
            layerControl,
            onChangeLayerList,
            showMapStatus
        }
    }
}
</script>

<template>
    <div class="SearchBar row flex-wrap mx-0">
        <ul class="list-unstyled d-flex align-items-center flex-nowrap">
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white">
                    <!-- <img :src="`./assets/img/icon/${state.dimensionMapStatus == '2D' ? 'twoDimensional.svg' : 'threeDimensional.svg' }`" alt=""> -->
                    <img src="./assets/img/icon/twoDimensional.svg" v-if="state.dimensionMapStatus == '2D'" @click.prevent="toolSwitch('threeDimensionalBtn'), onChangeDimensionMap('3D')">
                    <img src="./assets/img/icon/threeDimensional.svg" v-else @click.prevent="toolSwitch('threeDimensionalBtn'), onChangeDimensionMap('2D')">
                </a>
            </li>
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white" @click.prevent="toolSwitch('layerConditionBtn')">
                    <img src="./assets/img/icon/baseLayer.svg" alt="">
                </a>
            </li>
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white" @click.prevent="toolSwitch('splitWindowBtn')">
                    <img src="./assets/img/icon/singleWindow.svg" alt="">
                </a>
                <ul class="list-unstyled position-absolute start-0 top-100 p-0"
                    v-if="state.selectFeature == 'splitWindowBtn'">
                    <li class="mt-2">
                        <a href="" class="text-white MapFeatureBtn" @click.prevent="onChangeMapCount(1)">
                            <img src="./assets/img/icon/singleWindow.svg" alt="">
                        </a>
                    </li>
                    <li class="mt-2">
                        <a href="" class="text-white MapFeatureBtn" @click.prevent="onChangeMapCount(2)">
                            <img src="./assets/img/icon/doubleWindows.svg" alt="">
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <div class="asideTool position-absolute top-50 translate-middle-y d-flex flex-nowrap flex-column" id="asideTool">
        <a href="" class="asideTool-btn order-1 mb-0" @click.prevent="mapControl('In')">
            <img src="./assets/img/icon/zoomIn.svg" alt="zoomIn">
        </a>
        <a href="" class="asideTool-btn order-1 mb-2" @click.prevent="mapControl('Out')">
            <img src="./assets/img/icon/zoomOut.svg" alt="zoomOut">
        </a>
        <a href="" class="asideTool-btn order-1 mb-2" @click.prevent="mapControl('toNorth')">
            <img src="./assets/img/icon/compass.svg" alt="compass">
        </a>
        <a href="" class="asideTool-btn order-1 mb-2" @click.prevent="layerControl('moveTo')">
            <!-- location缺圖 -->
            <img src="./assets/img/icon/location.svg" alt="location">
        </a>
        <a href="" class="asideTool-btn order-1 mb-2" @click.prevent="mapControl('fullScreen')">
            <img src="./assets/img/icon/zoom.svg" alt="zoom">
        </a>
        <div class="asideTool-btn order-1 mb-2 bg-white" style="z-index: 999;cursor: pointer;" @click="showMapStatus">123</div>
    </div>
    <div class="switchControl d-flex position-fixed rounded-pill translate-middle-x" id="switchControl" v-if="state.switchControl" style="z-index: 99;padding: 5px;">
        <div class="fs-3 text-white rounded-pill"
        :class="{'active': state.targetNum === 1}"
        @click="()=>{
            state.targetNum = 1
            // $(`.map1`).addClass('currentMap')
            // $(`.map2`).removeClass('currentMap')
        }">左</div>
        <div class="fs-3 text-white rounded-pill"
        :class="{'active': state.targetNum === 2}"
        @click="()=>{
            state.targetNum = 2
            // $(`.map2`).addClass('currentMap')
            // $(`.map1`).removeClass('currentMap')
        }">右</div>
    </div>
    <div class="main">
        <div v-if="true">
            <!-- <Wes ref="mapCom"
                :targetNum="state.targetNum"
            /> -->
            <WebMap ref="mapCom"
                :targetNum="state.targetNum" :layerList="state.layerList"
            />
        </div>
        <div v-else>
            <threeDimensionMap />
        </div>
    </div>
    <div class="condition bg-white position-absolute end-0 bottom-0 mt-2"
        v-if="state.selectFeature == 'layerConditionBtn'">
        <div class="p-3">
            <p>地圖一狀態 {{ state.hasLayers }}</p>
            <p>1.點擊
            <div class="text-blue" @click="onMoveTo">前往示範案例</div>
            </p>
            <div>
                <input type="checkbox" name="example" id="example" @change="onExampleChange">
                <label for="example">2.開啟圖層</label>
            </div>
            <p class="">圖層選項</p>
            <div>
                <ul>
                    <li><a href="">核心圖層</a></li>
                    <li><a href="">衛星影像</a></li>
                    <li><a href="">航空照片</a></li>
                    <li><a href="">核心圖層 </a></li>
                </ul>
            </div>
        </div>
        <condition></condition>
    </div>
    <div class="mapSourceOption">
        <mapSourceOption />
    </div>
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
.mapSourceOption
    position: fixed
    top: 0
    right: 0

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
    left: 50%
    background: $black-deep
    box-sizing: border-box
    div
        padding:5px 28px
        cursor: pointer
        box-sizing: border-box
    .active
        background: $blue-steel
// 當前選取地圖樣式
.currentMap
    position: relative
    // &::after
    //     content: ''
    //     position: absolute
    //     top: 0
    //     left: 0
    //     width: 100%
    //     height: 100%
    //     border: 5px solid red
    //     box-sizing: border-box

.SearchBar
    position: absolute
    top: 20px
    left: 20px
    z-index: 220
.MapFeatureBtn
    display: block
    border-radius: 10px
    width: 68px
    height: 68px
    box-sizing: border-box
    img
        width: 100%
        height: 100%
        &:hover
            filter: brightness(0.5)
    svg
        font-size: 24px
        width: 100%
        height: 100%
.condition
    width: 500px
</style>
