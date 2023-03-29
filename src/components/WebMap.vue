<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol'
import OSM from 'ol/source/OSM'
import TileWMS from 'ol/source/TileWMS'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊

import { TileArcGISRest } from 'ol/source.js'

import XYZ from 'ol/source/XYZ'
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'
import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import TileGrid from 'ol/layer/Tile.js';

import PerspectiveMap from "ol-ext/map/PerspectiveMap"
import 'ol-ext/dist/ol-ext.css'

import EsriJSON from 'ol/format/EsriJSON.js'
import { createXYZ } from 'ol/tilegrid.js'
import { tile as tileStrategy } from 'ol/loadingstrategy.js'
import { Circle, Polygon } from 'ol/geom.js'
import Projection from 'ol/proj/Projection.js'
import GeoJSON from 'ol/format/GeoJSON.js'

import OLCesium from 'olcs/OLCesium.js';
import 'ol/ol.css'

import mapLayerList from '../config/mapLayerList'
import baseMapList from '../config/baseMapList'
import { Label } from 'cesium'

export default {
    props: {},
    setup(props, { emit }) {
        const mapLayers = mapLayerList
        const baseMaps = baseMapList
        const state = reactive({
            defaultCenter: [120.971859, 24.801583], //lng, lat
            defaultCenterZoom: 14,
            targetNum: 1,
            conditionWrap: false,
            layerSelect: false,
            currentLayers: [],
            // mapLayers: Object.keys(mapLayers).map(node => node),
            Layers: [],
            mapLayers: computed(()=>{
                return state.Layers.map((node,index)=>{
                    return {
                        label: node.group_title,
                        value: node.value,
                        layers: node.group_layers
                    }
                })
            }),
            baseMapsOptions: computed(() => baseMapList.sourceData()),
            selectLock: false,

            mapCount: 1,
            map1: null,
            map2: null,
            map1LayerStatus: [],
            map2LayerStatus: [],
            deleteLightbox: false,
            // 目前地圖狀態為2D or 3D
            dimensionMap: {
                map1: '2D',
                map2: '2D'
            },
            toSearchDimensionStatus: computed(() => {
                let target = state.targetNum == 1 ? 'map1' : 'map2'
                return state.dimensionMap[target] === '2D'
            }),
            areaDataId: '',
            ol3d: null,
        })

        const defaultView = new View({
            projection: 'EPSG:4326',
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
        })

        const overlay = ref(null)
        const popupCom = ref(null) // 弹窗容器
        let ol3d = null

        // 初始化地圖
        function initMap() {
            overlay.value = new Overlay({
                element: popupCom.value,
                autoPan: true,
                autoPanAnimation: {
                    duration: 250
                }
            })

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
            let targetLayers = target?.getLayers()
            switch (action) {
                case 'layerMode':
                    // need continue
                    retrun
                    if (value.checked) {
                        let newTileLayer = mapLayers[value.layerName]()
                        if (Array.isArray(newTileLayer)) {
                            newTileLayer.forEach(node=>{
                                target.addLayer(node)
                            })
                            // 點擊事件
                            target.on('click', function (evt) {
                                const feature =target.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                                    return feature
                                })

                                if (feature) {
                                    const coordinate = evt.coordinate
                                    state.areaDataId = feature.get('name')
                                    overlay.value.setPosition(coordinate)
                                } else {
                                    overlay.value.setPosition(undefined)
                                }

                            })
                            target.addOverlay(overlay.value)
                        } else {
                            target.addLayer(newTileLayer)
                        }
                        onMapLayerStatus('add', target.getTarget(), value.layerName)
                    } else {
                        let layersAry = targetLayers.getArray()

                        // while (element.get('name') == value.layerName) {
                        //     target.removeLayer(element)
                        // }
                        // fix!!
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
                                    target.removeLayer(element)
                                }
                            })
                    }
                    break;
                case 'changeOrder':
                    if (state.selectLock) { return }

                    let layerName = targetLayers.getArray()[value.key].get('name')
                    let nowTileLayer = mapLayers[layerName]()
                    if (value.movement === 'up') {
                        if (value.key == targetLayers.getArray().length) { return }
                        targetLayers.getArray().forEach(element => {
                            if (element.get('name') === layerName) {
                                target.removeLayer(element)
                            }
                        })
                        targetLayers.insertAt(value.key + 1, nowTileLayer)
                    }
                    if (value.movement === 'down') {
                        if (value.key == 0) { return }

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
                    let newTileLayer = baseMaps.sourceFun(value.layerName)
                    targetLayers.extend([newTileLayer])

                    let layersAry = targetLayers.getArray()
                    layersAry.forEach(element => {
                        if (element.get('name') !== value.layerName) {
                            target.removeLayer(element)
                        }
                    })
                    break;
                case 'changeMapCount':
                    if (state.mapCount === value) {return}
                    let otherMap = state.targetNum !== 1 ? 'map1' : 'map2'
                    state.mapCount = value
                    if (value === 2) {
                        if (state[`${otherMap}LayerStatus`]?.indexOf('3D') !== -1 ) {
                            let otherLayers = state[`${otherMap}LayerStatus`].filter(node=> node !== '3D')
                            state[otherMap] = new Map({
                                target: otherMap,
                                layers: [
                                    baseMapList.sourceFun('default'),
                                    ...otherLayers.map(node => mapLayerList[node]())
                                ],
                                view: defaultView,
                                controls: [],
                            })
                            ol3d = new OLCesium({
                                map: state[otherMap],
                            })
                            ol3d.setEnabled(true)
                        } else {
                            state[otherMap] = new Map({
                                target: otherMap,
                                layers: [
                                    baseMapList.sourceFun('default'),
                                    ...state[`${otherMap}LayerStatus`].map(node => mapLayerList[node]())
                                ],
                                view: defaultView,
                                controls: [],
                            })
                        }
                    }
                    if (value === 1) {
                        state[otherMap] = null
                        const element = document.getElementById(otherMap)
                        while (element.firstChild) {
                            element.removeChild(element.firstChild)
                        }
                    }
                    break;
                case 'changeDimensionMap':
                    let ta = state.targetNum == 1 ? 'map1' : 'map2'
                    state.dimensionMap[ta] = value
                    if (value === '3D') {
                        ol3d = new OLCesium({
                            map: target,
                        })
                        ol3d.setEnabled(true)
                        state[`${ta}LayerStatus`].push('3D')
                    } else {
                        ol3d.setEnabled(false)
                        state[`${ta}LayerStatus`] = state[`${ta}LayerStatus`].filter(node => node !== '3D')
                    }
                    break;
            }
            getCurrentLayerNames()
        }

        function changeTarget(value) {
            state.targetNum = value
            let delToMap = state.targetNum !== 1 ? 'map1' : 'map2'
            if (state.mapCount === 1) {
                // 目標地圖為空
                if (!state[`map${value}`]) {
                    if (state[`map${value}LayerStatus`]?.indexOf('3D') !== -1 ) {
                        let otherLayers = state[`map${value}LayerStatus`].filter(node=> node !== '3D')
                        state[`map${value}`] = new Map({
                            target: `map${value}`,
                            layers: [
                                baseMapList.sourceFun('default'),
                                ...otherLayers.map(node => mapLayerList[node]())
                            ],
                            view: defaultView,
                            controls: [],
                        })
                        ol3d = new OLCesium({
                            map: state[`map${value}`],
                        })
                        ol3d.setEnabled(true)
                    } else {
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
                }
                // 非目標地圖的刪除
                if (state[delToMap]) {
                    state[delToMap] = null
                    const element = document.getElementById(delToMap)
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
            const layers = target?.getLayers()?.getArray()
            state.currentLayers = layers?.map(layer => {
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

        function closeMapData() {
            overlay.value.setPosition(undefined)
        }


        onMounted(() => {
            $.ajax({
                url : 'https://api.edtest.site/layers',
                method : "GET"
            }).done(res=>{
                state.Layers = res.map((node, index) => {
                    return {
                        ...node,
                        value: index
                    }
                })
            }).fail(FailMethod=>{
                console.log('Fail', FailMethod)
            });
            nextTick(() => {
                initMap()
                getCurrentLayerNames()
            })
        })

        return {
            state,
            props,
            popupCom,
            overlay,
            mapControl,
            layerControl,
            getCurrentLayerNames,
            changeTarget,
            conditionWrap,
            onMapLayerStatus,
            closeMapData
        }
    }
}
</script>

<template>
    <div>
        <div class="SearchBar position-absolute">
            <SearchBar :dimensionMapStatus="state.toSearchDimensionStatus" :currentLayers="state.currentLayers"
                :mapCount="state.mapCount" @onLayerControl="({ action, value }) => { layerControl({ action, value }) }"
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
                    <condition
                    v-bind="{
                        mapLayers: state.mapLayers,
                        currentLayers: state.currentLayers,
                        onClose: () => {
                            state.conditionWrap = false
                        }
                    }"
                    @onMapControl="({ action, value }) => { mapControl({ action, value }) }"
                    />
                    <!-- need continue -->
                    <!-- @onLayerControl="({ action, value }) => { layerControl({ action, value }) }" -->
                </div>
            </div>

            <div>
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold"
                    v-if="!state.layerSelect" @click="state.layerSelect = true">
                    已選擇的圖層
                </button>
                <div v-if="state.layerSelect">
                    <layerSelect
                    v-bind="{
                        selectLock: state.selectLock,
                        currentLayers: state.currentLayers,
                        onClose:() => {
                            state.layerSelect = false
                        },
                        onChangLayerVisible:(action) => {
                            layerControl(action)
                        },
                        onChangeOrderLayer:({ action, value }) => {
                            layerControl({ action, value })
                        },
                        onLockLayer:() => {
                            state.selectLock = !state.selectLock
                        },
                        onDeleteLayer:({ action, value }) => {
                            if (value.layerName == 'all') {
                                state.deleteLightbox = true
                            } else {
                                layerControl({ action, value })
                            }
                        },
                        onDeleteLayerAll:() => {
                            state.deleteLightbox = true
                        }
                    }" />
                </div>
            </div>
        </div>
        <div class="lightWrap w-100 h-100 d-flex justify-content-center align-items-center" v-if="state.deleteLightbox">
            <div class="p-4 rounded bg-white">
                <p>是否要刪除全部圖層</p>
                <div class=" d-flex justify-content-around">
                    <button @click="() => {
                        layerControl({
                            action: 'selectLayerMode',
                            value: {
                                layerName: 'all'
                            }
                        })
                        state.deleteLightbox = false
                    }">是</button>
                    <button @click="() => {
                        state.deleteLightbox = false
                    }">否</button>
                </div>
            </div>
        </div>

        <!-- 弹窗容器 -->
        <div ref="popupCom" class="areaData">
            <areaData :id="state.areaDataId" />
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


.areaData
    width: 450px
    background: #fff
    position: absolute
    bottom: 100%
    right: 0
    box-sizing: border-box
    padding: 10px

</style>
