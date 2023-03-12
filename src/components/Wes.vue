<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊

import { TileArcGISRest } from 'ol/source.js'

import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'
import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import { Image as ImageLayer } from 'ol/layer.js'
import ImageWMS from 'ol/source/ImageWMS'
import { FullScreen, defaults as defaultControls } from 'ol/control.js'
import { defaults as defaultInteractions, DragRotateAndZoom } from 'ol/interaction'
import PerspectiveMap from "ol-ext/map/PerspectiveMap"
import 'ol-ext/dist/ol-ext.css'

import EsriJSON from 'ol/format/EsriJSON.js'
import { createXYZ } from 'ol/tilegrid.js'
// import { fromLonLat } from 'ol/proj.js'
import { tile as tileStrategy } from 'ol/loadingstrategy.js'

import 'ol/ol.css' // ol提供的css样式

import mapLayerList from '../config/mapLayerList'
import baseMapList from '../config/baseMapList'

export default {
    props: {},
    setup(props, { emit }) {
        const mapLayers = mapLayerList
        const baseMaps = baseMapList
        const state = reactive({
            defaultCenter: [120.971859, 24.801583], //lng, lat
            defaultCenterZoom: 17,
            targetNum: 1,
            conditionWrap: false,
            layerSelect: true,
            currentLayers: [],
            mapLayers: Object.keys(mapLayers).map(node => node),
            baseMapsOptions: computed(() => baseMapList.sourceData()),
            selectLock: false,

            map1LayerStatus: [],
            map2LayerStatus: [],
            map1: null,
            map2: null,
            mapCount: 1,
            deleteLightbox: false
        })

        const defaultView = new View({
            projection: 'EPSG:4326',
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
        })

        // 初始化地圖
        function initMap() {
            state.map1 = new Map({
                target: 'map1',
                layers: [baseMapList.sourceFun('default')],
                view: defaultView,
                controls: [],
            })
        }

        function addPoint(targetLng, targetLat) {
            const marker = new Vector({
                source: new VectorSource({
                    features: [
                        new Feature({
                            geometry: new Point([targetLng, targetLat]),
                            name: 'Null Island',
                            population: 4000,
                            rainfall: 500,
                        })
                    ]
                }),
                style: new Style({
                    image: new Icon({
                        anchor: [0.5, 100],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        // 圖片連結需修改
                        src: 'https://www.ockert-cnc.de/wp-content/uploads/2016/12/map-marker-icon-100x100.png',
                    }),
                })
            })

            let target = state.targetNum == 1 ? 'map1' : 'map2'
            state[target].addLayer(marker)
        }

        function mapControl({ action, value }) {
            let mainMap = state.map1?.getTarget() == null ? 'map2' : 'map1'
            let View = state[mainMap].getView()
            switch (action) {
                case 'In':
                    View.animate({
                        zoom: View.getZoom() + 1,
                    })
                    break;
                case 'Out':
                    View.animate({
                        zoom: View.getZoom() - 1,
                    })
                    break;
                case 'toNorth':
                    View.animate({
                        rotation: 0,
                    })
                    break;
                case 'moveTo':
                    if (value) {
                        const { xAxis, yAxis } = value
                        View.animate({
                            center: [xAxis, yAxis],
                            zoom: 10,
                            duration: 100,
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(function (pos) {
                            View.animate({
                                center: [pos.coords.longitude, pos.coords.latitude],
                                zoom: 17,
                                duration: 100,
                            });
                            addPoint(pos.coords.longitude, pos.coords.latitude)
                        })
                    }
                    break;
                case 'fullScreen':
                    let target = document.getElementById(`map${state.targetNum}`)
                    if (target.requestFullscreen) {
                        target.requestFullscreen()
                    } else if (target.msRequestFullscreen) {
                        target.msRequestFullscreen()
                    } else if (target.mozRequestFullScreen) {
                        target.mozRequestFullScreen()
                    } else if (target.webkitRequestFullscreen) {
                        target.webkitRequestFullscreen()
                    }
                    break;
            }
        }

        function layerControl({ action, value }) {
            let target = state.targetNum == 1 ? state.map1 : state.map2
            let targetView = target?.getView()
            let targetLayers = target?.getLayers()
            switch (action) {
                case 'layerMode':
                    if (value.checked) {
                        let newTileLayer = mapLayers[value.layerName]()
                        target.addLayer(newTileLayer)
                        onMapLayerStatus('add', target.getTarget(), value.layerName)
                    } else {
                        let layersAry = targetLayers.getArray()
                        layersAry.forEach(element => {
                            if (element.get('name') == value.layerName) {
                                target.removeLayer(element)
                            }
                        })
                        onMapLayerStatus('delete', target.getTarget(), value.layerName)
                    }
                    break;
                case 'selectLayerMode':
                    if (state.selectLock) { return }
                    if (value.layerName === 'all') {
                        let layersToRemove = []
                        let layersAry = targetLayers.getArray()
                        layersAry.forEach(element => {
                            if (element.get('name') !== 'default') {
                                layersToRemove.push(element)
                            }
                        })
                        layersToRemove.forEach(function (node) {
                            target.removeLayer(node)
                        })
                    } else {
                        let layersAry = targetLayers.getArray()
                        layersAry.forEach(element => {
                            if (element.get('name') == value.layerName) {
                                target.removeLayer(element);
                            }
                        })
                    }
                    break;
                case 'changeOrder':
                    if (state.selectLock || value.key === 0) { return }
                    let layerName = targetLayers.getArray()[value.key].get('name')
                    let nowTileLayer = mapLayers[layerName]()
                    if (value.movement === 'up') {
                        if (value.key + 1 == targetLayers.getArray().length) { return }

                        targetLayers.getArray().forEach(element => {
                            if (element.get('name') == layerName) {
                                target.removeLayer(element);
                            }
                        })
                        targetLayers.insertAt(value.key + 1, nowTileLayer)
                    }
                    if (value.movement === 'down') {
                        if (value.key - 1 == 0) { return }

                        targetLayers.getArray().forEach(element => {
                            if (element.get('name') == layerName) {
                                target.removeLayer(element);
                            }
                        })
                        targetLayers.insertAt(value.key - 1, nowTileLayer)
                    }
                    getCurrentLayerNames()

                    break;
                case 'changeLayerVisible':
                    if (state.selectLock) { return }
                    let a = !(targetLayers.getArray()[value.key].getVisible())
                    targetLayers.getArray()[value.key].setVisible(a)
                    break;
                case 'baseMap':
                    // 新增底圖
                    let newTileLayer = baseMaps.sourceFun(value.layerName)
                    targetLayers.extend([newTileLayer])

                    // 刪除其餘底圖
                    let layersAry = targetLayers.getArray();
                    layersAry.forEach(element => {
                        if (element.get('name') !== value.layerName) {
                            target.removeLayer(element);
                        }
                    });
                    break;
                case 'changeMapCount':
                    let actionToMap = state.targetNum !== 1 ? 'map1' : 'map2'
                    state.mapCount = value
                    if (value === 2) {
                        state[actionToMap] = new Map({
                            target: actionToMap,
                            layers: [
                                baseMapList.sourceFun('default'),
                                ...state[`${actionToMap}LayerStatus`].map(node => mapLayerList[node]())
                            ],
                            view: defaultView,
                            controls: [],
                        })
                    }
                    if (value === 1) {
                        state[actionToMap] = null
                        const element = document.getElementById(actionToMap)
                        while (element.firstChild) {
                            element.removeChild(element.firstChild)
                        }
                    }
                    break;
                case 'changeDimensionMap':
                    if (value === '3D') {
                        target = new PerspectiveMap({
                            target: state.targetNum == 1 ? 'map1' : 'map2',
                            layers: [baseMapList.sourceFun('default', 'name', 'three')],
                            view: defaultView,
                            controls: [],
                        })
                        // let newTileLayer = baseMapList.sourceFun('default')
                        // layerControl({
                        //     action: "changeOrder",
                        //     value: {movement: 'up', key: 1}
                        // })
                    } else {
                        // fixed !!!
                        target = new Map({
                            target: target,
                            layers: [baseMapList.sourceFun('default')],
                            view: targetView,
                            controls: [],
                        })
                    }
                    break;
            }
            getCurrentLayerNames()
        }

        function changeTarget(value) {
            state.targetNum = value
            let actionToMap = state.targetNum !== 1 ? 'map1' : 'map2'
            if (state.mapCount === 1) {
                if (!state[`map${value}`]) {
                    state[`map${value}`] = new Map({
                        target: `map${value}`,
                        layers: [
                            baseMapList.sourceFun('default'),
                            ...state[`map${value}LayerStatus`].map(node => mapLayerList[node]())
                        ],
                        view: defaultView,
                        controls: [],
                    })
                }
                if (state[actionToMap]) {
                    layerControl({ action: 'changeMapCount', value: 1 })
                    state[actionToMap] = null
                    // 清空dom元素
                    const element = document.getElementById(actionToMap)
                    while (element.firstChild) {
                        element.removeChild(element.firstChild)
                    }
                }
            }
            nextTick(() => {
                getCurrentLayerNames()
            })
        }

        function getCurrentLayerNames() {
            let target = state.targetNum == 1 ? state.map1 : state.map2
            const layers = target.getLayers().getArray()
            state.currentLayers = layers.map(layer => {
                return {
                    name: layer.get('name'),
                    visible: layer.getVisible(),
                }
            })
        }

        function conditionWrap() {
            state.conditionWrap = !state.conditionWrap
        }

        function onMapLayerStatus(action, target, name) {
            if (action === 'add') {
                state[`${target}LayerStatus`].push(name)
            } else if (action === 'delete') {
                let a = state[`${target}LayerStatus`].findIndex(node => node === name)
                state[`${target}LayerStatus`].splice(a, 1)
            } else {
            }
        }

        onMounted(() => {
            initMap()
            nextTick(() => {
                getCurrentLayerNames()
            })
        })

        return {
            state,
            props,
            mapControl,
            layerControl,
            getCurrentLayerNames,
            changeTarget,
            conditionWrap,
            onMapLayerStatus,
        }
    }
}
</script>

<template>
    <div>
        <div class="SearchBar position-absolute">
            <SearchBar :currentLayers="state.currentLayers" :mapCount="state.mapCount"
                @onLayerControl="({ action, value }) => { layerControl({ action, value }) }"
                @onChangeTarget="(value) => { changeTarget(value) }" @conditionWrap="(value) => { conditionWrap(value) }" />
        </div>
        <div class="mapSourceOption">
            <mapSourceOption :baseMapsOptions="state.baseMapsOptions"
                @onChangeBaseMaps="({ action, value }) => { layerControl({ action, value }) }" />
        </div>
        <div class="asideTool position-absolute top-50 translate-middle-y" id="asideTool">
            <asideTool @onMapControl="({ action, value }) => { mapControl({ action, value }) }" />
        </div>
        <div class="w-100 d-flex flex-nowrap mapWrap" id="mapWrap">
            <!-- needfix -->
            <div id="map1" :class="{ 'w-100': state.map1?.getTarget() == 'map1' }"></div>
            <div class="middleLine" v-if="state.mapCount === 2"></div>
            <div id="map2" :class="{ 'w-100': state.map2?.getTarget() == 'map2' }"></div>
        </div>
        <div class="condition position-absolute">
            <div class="mb-2">
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold"
                    v-if="!state.conditionWrap" @click="state.conditionWrap = true">
                    圖層選項
                </button>
                <div class="mb-4" v-if="state.conditionWrap">
                    <condition :mapLayers="state.mapLayers" :currentLayers="state.currentLayers" :onClose="() => {
                        state.conditionWrap = false
                    }" @onMapControl="({ action, value }) => { mapControl({ action, value }) }"
                        @onLayerControl="({ action, value }) => { layerControl({ action, value }) }" />
                </div>
            </div>

            <div>
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold"
                    v-if="!state.layerSelect" @click="state.layerSelect = true">
                    已選擇的圖層
                </button>
                <div v-if="state.layerSelect">
                    <layerSelect
                    :selectLock="state.selectLock"
                    :onClose="() => {
                        state.layerSelect = false
                    }"
                    :onChangLayerVisible="(action) => {
                        layerControl(action)
                    }"
                    :currentLayers="state.currentLayers"
                    :onChangeOrderLayer="({ action, value }) => {
                        layerControl({ action, value })
                    }"
                    :onLockLayer="() => {
                        state.selectLock = !state.selectLock
                    }"
                    :onDeleteLayer="({ action, value }) => {
                        if (value.layerName == 'all') {
                            state.deleteLightbox = true
                        } else {
                            layerControl({ action, value })
                        }
                    }"
                    :onDeleteLayerAll="() => {
                        state.deleteLightbox = true
                    }"
                    />
                </div>
            </div>
        </div>
        <div class="lightWrap w-100 h-100 d-flex justify-content-center align-items-center" v-if="state.deleteLightbox">
            <div class="lightbox p-4 rounded">
                <p>是否要刪除全部圖層</p>
                <div class=" d-flex justify-content-around">
                    <button @click="()=>{
                        layerControl({
                            action: 'selectLayerMode',
                            value: {
                                layerName: 'all'
                            }
                        })
                        state.deleteLightbox = false
                    }">是</button>
                    <button @click="()=>{
                        state.deleteLightbox = false
                    }">否</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass">
@import '../assets/styles/all.module.scss'
.mapWrap
    justify-content: space-between
    height: 100vh

.mapWrap .ol-viewport
    height: 100vh
    width: 100vw


.asideTool
    z-index: 220
    left: 5px
.SearchBar
    position: absolute
    top: 20px
    left: 20px
    z-index: 220
.condition
    width: 440px
    right: 1%
    bottom: 5%

.mapSourceOption
    position: fixed
    top: 20px
    right: 20px
    z-index: 220

.middleLine
    width: 5px
    background: $blue-steel
</style>
