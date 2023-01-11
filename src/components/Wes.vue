<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM'
// import Layer from 'ol/layer/Layer.js'
// import {VectorSource, XYZ} from 'ol/source.js';
import { Vector as VectorSource, XYZ } from 'ol/source.js';
import { Icon, Style } from 'ol/style.js'
import { Image as ImageLayer, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import { FullScreen, defaults as defaultControls } from 'ol/control.js';
// import * from 'ol-ext'
import { layer } from '../assets/dist/ol-ext'

export default {
    props: {
        // count: {
        //     type: Number,
        //     default: ''
        // },
    },
    setup(props, { emit }) {
        const state = reactive({
            defaultCenter: [120.971859, 24.801583], //lng, lat
            defaultCenterZoom: 17,
        })
        const mapCom = ref(null) // 地圖容器
        const map = ref(null) // 地圖實例
        const defaultLayers = [ // 圖層
            new TileLayer({
                preload: Infinity,
                name: 'defaultLayer',
                source: new OSM() // 圖層數據
            }),
            // new TileLayer({
            //     source: new XYZ({
            //         url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            //     })
            // })
        ];
        const defaultView = new View({
            projection: 'EPSG:4326', // 投影座標系
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
            rotation: Math.PI / 4,
        });

        function initMap() {
            map.value = new Map({
                target: mapCom.value,
                layers: defaultLayers,
                view: defaultView,
                controls: [
                    new FullScreen()
                ],
            })
            var terrain = new Elevation({
                source: new XYZ({
                    url: 'https://assets.agi.com/stk-terrain/v1/tiles/4326/{z}/{x}/{y}.png',
                    crossOrigin: 'anonymous',
                })
            })
            map.value.addLayer(terrain)
        }
        onMounted(() => {
            initMap()
        })

        return {
            state,
            props,
            mapCom,
        }
    }
}
</script>

<template>
    <div id="map1" ref="mapCom" class="mapWrap"></div>
</template>

<style lang="sass" scoped>
.mapWrap
    justify-content: space-between
    height: 100vh

.mapWrap div
    width: 100%

.asideTool
    position: absolute
    right: 0
    top: 50%
    z-index: 220
    transform: translateY(-50%)
    div
        background: #fff
        margin: 20px
        padding: 20px
        font-size: 20px
        border: 1px solid #000

// bug
.compass
    position: absolute
    right: 0
    bottom: 0
    width: 100px
    height: 100px
    img
        transform: rotateZ(-90deg)
        width: 100%
        height: 100%
.ol-full-screen button
    width: 50px
    height: 50px
</style>
