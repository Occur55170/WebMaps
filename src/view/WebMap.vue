<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol'
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';

import { ImageArcGISRest, OSM } from 'ol/source.js'
import TileWMS from 'ol/source/TileWMS'
import { IGC, WFS, } from 'ol/format'
import * as ol from 'ol';
import { TileArcGISRest } from 'ol/source.js'


import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import ImageWMS from 'ol/source/ImageWMS.js';
import TileGrid from 'ol/layer/Tile.js';

import PerspectiveMap from "ol-ext/map/PerspectiveMap"

import EsriJSON from 'ol/format/EsriJSON.js'
import { createXYZ } from 'ol/tilegrid.js'
import { bbox, tile as tileStrategy } from 'ol/loadingstrategy.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import Projection from 'ol/proj/Projection.js'
import GeoJSON from 'ol/format/GeoJSON.js'

import OLCesium from 'olcs/OLCesium.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
import TileState from 'ol/TileState.js';

import 'ol/ol.css'

import mapLayerList from '@/config/mapLayerList'
import baseMapList from '@/config/baseMapList'

import 'ol-ext/dist/ol-ext.css'
import * as olTilecoord from 'ol/tilecoord'
import { get as getProjection } from 'ol/proj';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo.js';

export default {
    props: {},
    setup(props, { emit }) {
        const mapLayers = mapLayerList
        const baseMaps = baseMapList
        const state = reactive({
            // defaultCenter: [120.971859, 24.801583],
            defaultCenter: [121.326776, 24.655499],
            defaultCenterZoom: 14,
            targetNum: 1,
            conditionWrap: false,
            layerSelect: false,
            currentLayers: [],
            layers: [],
            mapLayers: computed(() => {
                return state.layers.map((node, index) => {
                    return {
                        label: node.group_title,
                        value: node.value,
                        layers: node.group_layers,
                        groupClass: node.group_class
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
            ol3d: null,
            selectValueTemp: 0,
            areaData: {
                position: [],
                tribeAreaData: {},
            },
        })

        const defaultView = new View({
            projection: 'EPSG:4326',
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
        })

        let ol3d = null

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
            let targetLayers = target?.getLayers()
            switch (action) {
                case 'layerMode':
                    if (value.checked) {
                        if (!(state.layers[value.nodeIndex].group_layers[value.subNodeIndex].single_tiles)) {
                            let layersAry = targetLayers.getArray()
                            layersAry.forEach(element => {
                                if (!(element.get('id'))) { return }
                                if (element.get('id').includes(`node${value.nodeIndex}_subNode${value.subNodeIndex}_nestedSubNode`)) {
                                    target.removeLayer(element)
                                }
                            })
                            onMapLayerStatus('delete', target.getTarget(), value.id)
                        }
                        let nestedSubNodeIndex = value.nestedSubNodeIndex || state.selectValueTemp
                        let targetLayer = mapLayers.getLayer(state.layers[value.nodeIndex].group_layers[value.subNodeIndex], nestedSubNodeIndex, value.id)
                        target.addLayer(targetLayer)

                        // needfix 3接4
                        if (value.id === 'node0_subNode3_nestedSubNodeundefined') {
                            let obj1 = {
                                action: "layerMode",
                                value: {
                                    checked: true,
                                    id: "node0_subNode4_nestedSubNodeundefined",
                                    nestedSubNode: false,
                                    nestedSubNodeIndex: undefined,
                                    nodeIndex: 0,
                                    subNodeIndex: 4
                                }
                            }
                            layerControl(obj1)
                        }

                        if (value.id === 'node0_subNode4_nestedSubNodeundefined') {
                            mapClickEvent(target)
                        }

                        onMapLayerStatus('add', target.getTarget(), value.id)
                    } else {
                        let layersAry = targetLayers.getArray()
                        let toRemoveLayerId
                        // needfix: 此處寫死 淹水.台灣近岸海域風浪危害圖 兩個圖層，看之後是否可以改成以single_tiles判斷
                        switch (value.id) {
                            case 'node0_subNode0_nestedSubNodeundefined':
                                toRemoveLayerId = layersAry.filter(element => element.get('id') === 'node0_subNode0_nestedSubNodeundefined')
                                toRemoveLayerId.forEach((node) => {
                                    target.removeLayer(node)
                                })
                                break
                            case 'node3_subNode1_nestedSubNodeundefined':
                                toRemoveLayerId = layersAry.filter(element => element.get('id') === 'node3_subNode1_nestedSubNodeundefined')
                                toRemoveLayerId.forEach((node) => {
                                    target.removeLayer(node)
                                })
                                break
                            default:
                                layersAry.forEach(element => {
                                    if (element.get('id') == value.id) {
                                        target.removeLayer(element)
                                    }
                                })
                                break
                        }
                        onMapLayerStatus('delete', target.getTarget(), value.id)
                    }
                    break;
                case 'selectLayerMode':
                    if (state.selectLock) { return }
                    if (value.layerName === 'all') {
                        let layersAry = targetLayers.getArray()
                        let layersToRemove = layersAry.filter(node => node.get('name') !== 'default')
                        layersToRemove.forEach((node) => {
                            target.removeLayer(node)
                        })
                    } else {
                        let layersAry = targetLayers.getArray()
                        layersAry.forEach(element => {
                            if (element.get('id') == value.id) {
                                target.removeLayer(element)
                            }
                        })
                    }
                    break;
                case 'changeOrder':
                    if (state.selectLock) { return }
                    let layeredIndex = mapLayerList.getLayerIndex(value.id)
                    let nowTileLayer = mapLayers.getLayer(state.layers[layeredIndex.nodeIndex].group_layers[layeredIndex.subNodeIndex], layeredIndex.nestedSubNodeIndex, value.id)
                    if (value.movement === 'up') {
                        if (value.key + 1 == targetLayers.getArray().length) { return }
                        value.checked = false
                        layerControl({ action: 'layerMode', value: value })
                        targetLayers.insertAt(value.key + 1, nowTileLayer)
                    }
                    if (value.movement === 'down') {
                        if (value.key - 1 == 0) { return }
                        value.checked = false
                        layerControl({ action: 'layerMode', value: value })
                        targetLayers.insertAt(value.key - 1, nowTileLayer)
                    }
                    break;
                case 'changeLayerVisible':
                    if (state.selectLock) { return }
                    let visibleStatus = !(targetLayers.getArray()[value.key].getVisible())
                    targetLayers.getArray()[value.key].setVisible(visibleStatus)
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
                    if (state.mapCount === value) { return }
                    let otherMap = state.targetNum !== 1 ? 'map1' : 'map2'
                    state.mapCount = value
                    let otherLayers = state[`${otherMap}LayerStatus`].filter(node => node !== '3D')
                    let otherLayersData = otherLayers.map(item => mapLayerList.getLayerIndex(item))
                    if (value === 2) {
                        state[otherMap] = new Map({
                            target: otherMap,
                            layers: [
                                baseMapList.sourceFun('default'),
                                ...otherLayersData.map(node => mapLayers.getLayer(state.layers[node.nodeIndex].group_layers[node.subNodeIndex], node.nestedSubNodeIndex, node.id))
                            ],
                            view: defaultView,
                            controls: [],
                        })
                        if (state[`${otherMap}LayerStatus`]?.indexOf('3D') !== -1) {
                            ol3d = new OLCesium({
                                map: state[otherMap],
                            })
                            ol3d.setEnabled(true)
                            // needfix: token搬移到env
                            let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzM3MWFhYS0xMjNlLTQ3MTMtODFjZS0xZjMzM2I5NGZiYTEiLCJpZCI6MTMwODE4LCJpYXQiOjE2ODQwNzM3Mjl9.UYu4kBialPo19dcvosHzZTpg2BD1zkFQnjCD78YiiYo'
                            Cesium.Ion.defaultAccessToken = accessToken
                            let scene = ol3d.getCesiumScene({})
                            scene.terrainProvider = Cesium.createWorldTerrain({})
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
                        // needfix: token搬移到env
                        let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzM3MWFhYS0xMjNlLTQ3MTMtODFjZS0xZjMzM2I5NGZiYTEiLCJpZCI6MTMwODE4LCJpYXQiOjE2ODQwNzM3Mjl9.UYu4kBialPo19dcvosHzZTpg2BD1zkFQnjCD78YiiYo'
                        Cesium.Ion.defaultAccessToken = accessToken
                        let scene = ol3d.getCesiumScene({})
                        scene.terrainProvider = Cesium.createWorldTerrain({})
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
                    let otherLayers = state[`map${value}LayerStatus`].filter(node => node !== '3D')

                    // needfix: 優化，靶node0_subNode4_nestedSubNodeundefined移到最後面
                    if (otherLayers.includes('node0_subNode4_nestedSubNodeundefined')) {
                        let a = otherLayers.filter(node => node !== 'node0_subNode4_nestedSubNodeundefined')
                        otherLayers = [...a, 'node0_subNode4_nestedSubNodeundefined']
                    }

                    let otherLayersData = otherLayers.map(item => mapLayerList.getLayerIndex(item))

                    state[`map${value}`] = new Map({
                        target: `map${value}`,
                        layers: [
                            baseMapList.sourceFun('default'),
                            ...otherLayersData.map(node => mapLayers.getLayer(state.layers[node.nodeIndex].group_layers[node.subNodeIndex], node.nestedSubNodeIndex, node.layeredIndex))
                        ],
                        view: defaultView,
                        controls: [],
                    })

                    mapClickEvent(state[`map${value}`])


                    if (state[`map${value}LayerStatus`]?.indexOf('3D') !== -1) {
                        ol3d = new OLCesium({
                            map: state[`map${value}`],
                        })
                        ol3d.setEnabled(true)
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
                    label: layer.get('label'),
                    id: layer.get('id'),
                    visible: layer.getVisible(),
                }
            })
        }

        function conditionWrap() {
            state.conditionWrap = !state.conditionWrap
        }

        function onMapLayerStatus(action, target, id) {
            if (action === 'add') {
                state[`${target}LayerStatus`].push(id)
            } else if (action === 'delete') {
                let a = state[`${target}LayerStatus`].findIndex(node => node === id)
                state[`${target}LayerStatus`].splice(a, 1)
            } else {
                console.log('error')
            }
        }

        function mapClickEvent(target) {
            // 創建選擇器
            let selector = new Select({
                layers: target?.getLayers()?.getArray(), // 設置要進行點擊選擇的圖層
                condition: click // 設置觸發選擇的事件條件
            })

            // 將選擇器添加到地圖上
            target.addInteraction(selector)

            // 監聽選擇器的選擇變化事件
            selector.on('select', (event) => {
                // event,
                // console.log('event', event.mapBrowserEven.pixel)
                let selectedFeatures = event.selected; // 或者使用 event.target.getFeatures()
                if (event.selected) {
                    state.areaData.position = event.mapBrowserEvent.pixel
                    // 遍歷所選的要素
                    selectedFeatures.forEach((feature) => {
                        let properties = feature.getProperties()
                        Object.entries(properties).forEach(node => {
                            const key = node[0], value = node[1]
                            state.areaData.tribeAreaData[key] = value
                        })
                    })
                } else {

                }

                // fix: 定位地圖細節小窗
                // console.log(state.areaData.tribeAreaData.geometry)
            })
        }

        onMounted(async () => {
            await $.ajax({
                url: 'https://api.edtest.site/layers',
                method: "GET"
            }).done(res => {
                state.layers = res.map((node, index) => {
                    node.group_layers.forEach((sub, subIndex) => {
                        let subNodeIndex = undefined, nestedSubNodeIndex = undefined
                            subNodeIndex = subIndex
                            sub.id = `node${index}_subNode${subNodeIndex}_nestedSubNode${nestedSubNodeIndex}`
                        if (!(sub.single_tiles)) {
                            sub.tiles_list.forEach((nestedSub, nestedSubIndex) => {
                                nestedSubNodeIndex = nestedSubIndex
                                    nestedSub.id = `node${index}_subNode${subNodeIndex}_nestedSubNode${nestedSubNodeIndex}`
                            })
                        }
                    })
                    return {
                        ...node,
                        value: index,
                    }
                })
                nextTick(() => {
                    initMap()
                    getCurrentLayerNames()
                })
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
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
            }
        }
    }
</script>

<template>
    <div>
        <div class="SearchBar position-absolute">
            <img src="@/assets/logo.svg" alt="" class="mb-2">
            <SearchBar :dimensionMapStatus="state.toSearchDimensionStatus" :currentLayers="state.currentLayers"
                :mapCount="state.mapCount" @onLayerControl="({ action, value }) => { layerControl({ action, value }) }"
                @onChangeTarget="(value) => { changeTarget(value) }" @conditionWrap="(value) => { conditionWrap(value) }" />
        </div>
        <mapSourceOption class="mapSourceOption" :baseMapsOptions="state.baseMapsOptions"
            @onChangeBaseMaps="({ action, value }) => { layerControl({ action, value }) }" />

        <asideTool class="asideTool position-absolute top-50 translate-middle-y" id="asideTool"
            @onMapControl="({ action, value }) => { mapControl({ action, value }) }" />

        <div class="w-100 d-flex flex-nowrap mapWrap" id="mapWrap">
            <!-- needFix 寬度設定是否調整 -->
            <div id="map1" :class="{ 'w-100': state.map1?.getTarget() == 'map1' }"></div>
            <div class="middleLine" v-if="state.mapCount === 2"></div>
            <div id="map2" :class="{ 'w-100': state.map2?.getTarget() == 'map2' }"></div>
        </div>
        <div class="condition position-absolute">
            <div class="mb-2">
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold fs-5"
                    v-if="!state.conditionWrap" @click="state.conditionWrap = true">
                    圖層選項
                </button>
                <div class="mb-4" v-if="state.conditionWrap">
                    <condition v-bind="{
                        mapLayers: state.mapLayers,
                        currentLayers: state.currentLayers,
                        onClose: () => {
                            state.conditionWrap = false
                        },
                        showSelectLayerValue: (val) => {
                            state.selectValueTemp = val
                        }
                    }" @onMapControl="({ action, value }) => { mapControl({ action, value }) }"
                        @onLayerControl="({ action, value }) => { layerControl({ action, value }) }" />
                </div>
            </div>

            <div>
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold fs-5"
                    v-if="!state.layerSelect" @click="state.layerSelect = true">
                    已選擇的圖層
                </button>
                <div v-if="state.layerSelect">
                    <layerSelect v-bind="{
                        selectLock: state.selectLock,
                        currentLayers: state.currentLayers,
                        onClose: () => {
                            state.layerSelect = false
                        },
                        onChangLayerVisible: (action) => {
                            layerControl(action)
                        },
                        onChangeOrderLayer: ({ action, value }) => {
                            layerControl({ action, value })
                        },
                        onLockLayer: () => {
                            state.selectLock = !state.selectLock
                        },
                        onDeleteLayer: ({ action, value }) => {
                            if (value.layerName == 'all') {
                                state.deleteLightbox = true
                            } else {
                                layerControl({ action, value })
                            }
                        },
                        onDeleteLayerAll: () => {
                            state.deleteLightbox = true
                        }
                    }" />
                </div>
            </div>
        </div>
        <div class="lightWrap w-100 h-100 d-flex justify-content-center align-items-center" v-if="state.deleteLightbox">
            <div class="p-4 rounded bg-white" style="width: 250px;">
                <p class="text-center fw-bold">是否要刪除全部圖層</p>
                <div class=" d-flex justify-content-around">
                    <button class="rounded px-3 py-1 bg-steel text-white border-0" @click="() => {
                        layerControl({
                            action: 'selectLayerMode',
                            value: {
                                layerName: 'all'
                            }
                        })
                        state.deleteLightbox = false
                    }">確定</button>
                    <button class="rounded px-3 py-1 bg-secondary bg-gradient text-white border-0" @click="() => {
                        state.deleteLightbox = false
                    }">取消</button>
                </div>
            </div>
        </div>

        <!-- 地圖細節小窗 -->
        <!--  -->
        {{ state.areaData.position[0] }}
        {{ state.areaData.position[1] }}
        <areaData class="areaData"
        :style="{
            bottom: state.areaData.position[0],
            right: state.areaData.position[1],
        }"
        v-if="state.areaData?.tribeAreaData?.geometry"
        :closeMapData="() => {
            state.areaData.tribeAreaData = ''
        }"
        :tribeAreaData="state.areaData.tribeAreaData" :maxHeight="500" />
    </div>
</template>

<style lang="sass">
@import '@/assets/styles/all.module.scss'
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
    width: 480px
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
    max-height: 500px
    background: #fff
    position: absolute
    top: 50%
    right: 50%
    box-sizing: border-box
</style>
