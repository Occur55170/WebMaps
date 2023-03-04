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
            // fix!!
            currentLayers: [],
            mapLayers:Object.keys(mapLayers).map(node=>node),
            baseMaps:Object.keys(baseMaps).map(node=>node),
            selectLock: false
        })

        const defaultLayers = [
            new TileLayer({
                preload: Infinity,
                name: 'defaultLayer',
                source: new OSM(),
                enable: true
            }),
        ]

        const defaultView = new View({
            projection: 'EPSG:4326',
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
        })

        // 初始化地圖
        function initMap() {
            const map1 = document.createElement('div')
            map1.setAttribute('id', 'map1')
            map1.setAttribute('class', 'map1 w-100')
            document.getElementById('mapWrap').appendChild(map1)
            map1.value = new Map({
                target: 'map1',
                layers: defaultLayers,
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
            map1.value.addLayer(marker);
        }

        function mapControl({action, value}) {
            let View = map1.value.getView()
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
                    let target = map1
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

        function layerControl({action, value}) {
            let target = state.targetNum == 1 ? map1 : map2
            let targetView = target.value.getView()
            let targetLayers = target.value.getLayers()
            switch (action) {
                case 'layerMode':
                    if (value.checked) {
                        let newTileLayer
                        newTileLayer = mapLayers[value.layerName]()
                        target.value.addLayer(newTileLayer)
                    } else {
                        let layersAry = targetLayers.getArray()
                        layersAry.forEach(element => {
                            if(element.get('name') == value.layerName){
                                target.value.removeLayer(element);
                            }
                        })
                    }
                    break;
                case 'selectLayerMode':
                    if (state.selectLock) { return }
                    if (value.layerName === 'all') {
                        targetLayers.clear()
                    } else {
                        let layersAry = targetLayers.getArray()
                        layersAry.forEach(element => {
                            if(element.get('name') == value.layerName){
                                target.value.removeLayer(element);
                            }
                        })
                    }
                    break;
                case 'changeOrder':
                    if (state.selectLock || value.key === 0) { return }
                    let layerName = targetLayers.getArray()[value.key].get('name')
                    let nowTileLayer = mapLayers[layerName]()
                    if (value.movement === 'up') {
                        if (value.key+1 == targetLayers.getArray().length) { return }

                        targetLayers.getArray().forEach(element => {
                            if(element.get('name') == layerName){
                                target.value.removeLayer(element);
                            }
                        })
                        targetLayers.insertAt(value.key+1, nowTileLayer)
                    }
                    if (value.movement === 'down') {
                        if (value.key-1 == 0) { return }

                        targetLayers.getArray().forEach(element => {
                            if(element.get('name') == layerName){
                                target.value.removeLayer(element);
                            }
                        })
                        targetLayers.insertAt(value.key-1, nowTileLayer)
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
                    let newTileLayer = baseMaps[value.layerName]()
                    targetLayers.extend([newTileLayer])

                    // 刪除其餘底圖
                    let layersAry = targetLayers.getArray();
                    layersAry.forEach(element => {
                        if(element.get('name') !== value.layerName){
                            target.value.removeLayer(element);
                        }
                    });
                    break;
                case 'changeMapCount':
                    if (value === 2 && !document.getElementById('map2')) {
                        addMapCount()
                    }
                    if (value === 1) {
                        // needFix
                        if($('div').hasClass('currentMap')){
                            $('.currentMap').removeClass('currentMap')
                            $('#mapWrap').removeClass('redBackground')
                        }
                        state.targetNum= 1
                        if(document.getElementById('map2')){
                            document.getElementById('map2').remove()
                        }
                    }
                    break;
                case 'changeDimensionMap':
                    target.innerHTML = ''
                    if(value === '3D'){
                        const layer = new Tile({
                            name: 'OSM',
                            preload: Infinity,
                            source: new OSM()
                        })
                        target.value = new PerspectiveMap({
                            target: target,
                            layers: [layer],
                            view: targetView,
                            controls: [],
                        })
                    } else {
                        const layer = new TileLayer({
                            preload: Infinity,
                            name: 'defaultLayer',
                            source: new OSM()
                        })
                        target.value = new Map({
                            target: target,
                            layers: [layer],
                            view: targetView,
                            controls: [],
                        })
                    }
                    break;
            }
            getCurrentLayerNames()
        }

        function addMapCount() {
            const map2 = document.createElement('div')
            map2.setAttribute('id', 'map2')
            map2.setAttribute('class', 'map2 w-100')
            document.getElementById('mapWrap').appendChild(map2)

            map2.value = new Map({
                target: 'map2',
                layers: [
                    new TileLayer({
                        preload: Infinity,
                        name: 'defaultLayer',
                        source: new OSM()
                    })
                ],
                view: defaultView,
                controls: [],
            })

            // needFix
            nextTick(()=>{
                $(`#map1`).addClass('currentMap')
                $('.mapWrap').addClass('redBackground')
            })
        }

        function getCurrentLayerNames() {
            let target = state.targetNum == 1 ? map1 : map2
            const layers = target.value.getLayers().getArray()
            state.currentLayers = layers.map(layer => {
                return {
                    name: layer.get('name'),
                    visible: layer.getVisible(),
                }
            })
        }

        function changeTarget(value){
            // needFix
            $('.currentMap').removeClass('currentMap')
            $(`#map${value}`).addClass('currentMap')
            state.targetNum = value
            getCurrentLayerNames()
        }

        function conditionWrap(){
            state.conditionWrap = !state.conditionWrap
        }

        onMounted(() => {
            initMap()
            nextTick(()=>{
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
        }
    }
}
</script>

<template>
    <div ref="mapCom">
        <div class="SearchBar position-absolute">
            <SearchBar
            :currentLayers="state.currentLayers"
            @onLayerControl="({action, value})=>{layerControl({action, value})}"
            @onChangeTarget="(value)=>{changeTarget(value)}"
            @conditionWrap="(value)=>{conditionWrap(value)}"
            />
        </div>
        <div class="mapSourceOption">
            <mapSourceOption
            :baseMaps="state.baseMaps"
            @onChangeBaseMaps="({action, value})=>{layerControl({action, value})}" />
        </div>
        <div class="asideTool position-absolute top-50 translate-middle-y" id="asideTool">
            <asideTool @onMapControl="({action, value})=>{mapControl({action, value})}"  />
        </div>
        <div class="w-100 d-flex flex-nowrap mapWrap" id="mapWrap"></div>
        <div class="condition position-absolute">

            <div class="mb-2">
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold" v-if="!state.conditionWrap"
                @click="state.conditionWrap = true">
                    圖層選項
                </button>
                <div class="mb-4" v-if="state.conditionWrap">
                    <condition
                    :mapLayers="state.mapLayers"
                    :currentLayers="state.currentLayers"
                    :onClose="()=>{
                        state.conditionWrap = false
                    }"
                    @onMapControl="({action, value})=>{mapControl({action, value})}"
                    @onLayerControl="({action, value})=>{layerControl({action, value})}"
                    />
                </div>
            </div>

            <div>
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold" v-if="!state.layerSelect"
                @click="state.layerSelect = true">
                    已選擇的圖層
                </button>
                <div v-if="state.layerSelect">
                    <layerSelect
                    :selectLock="state.selectLock"
                    :onClose="()=>{
                        state.layerSelect = false
                    }"
                    :onChangLayerVisible="(action)=>{
                        layerControl(action)
                    }"
                    :currentLayers="state.currentLayers"
                    :onChangeOrderLayer="({action, value})=>{
                        layerControl({action, value})
                    }"
                    :onLockLayer="()=>{
                        state.selectLock = !state.selectLock
                    }"
                    :onDeleteLayer="({action, value})=>{
                        layerControl({action, value})
                    }"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" >
.mapWrap
    justify-content: space-between
    height: 100vh

.mapWrap .ol-viewport
    height: 100vh
    width: 100vw

// needFix
.redBackground
    background: red
// needFix
.currentMap
    position: relative
    clip-path: polygon(5px 5px,calc(100% - 5px) 5px, calc(100% - 5px) calc(100% - 5px), 5px calc(100% - 5px))

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
</style>
