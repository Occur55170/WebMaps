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

// import {defaults as defaultInteractions} from 'ol/interaction.js';
// import cesium from 'ol-cesium/dist/olcesium.js'

// import { Viewer } from 'cesium'
import { Ion, Viewer, createWorldTerrain, createOsmBuildings, Cartesian3, Math } from "cesium";
// import "cesium/Build/Cesium/Widgets/widgets.css";
// import OLCesium from 'olcs/OLCesium.js';
// import "cesium/Source/Widgets/CesiumWidget.css"
// import { buildModuleUrl } from 'cesium';

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
        const map = ref(null)
        const defaultLayers = [ // 圖層
            // new TileLayer({
            //     preload: Infinity,
            //     name: 'defaultLayer',
            //     source: new OSM() // 圖層數據
            // }),
            new TileLayer({
                source: new XYZ({
                    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                })
            })
        ];
        const defaultView = new View({
            projection: 'EPSG:4326', // 投影座標系
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
            // rotation: Math.PI / 10,
        });

        function initMap() {
            const map1 = document.createElement('div')
            map1.setAttribute('id', 'map1')
            map1.setAttribute('class', 'w-100')
            document.getElementById('mapWrap').appendChild(map1)
            // map1.value = new Map({
            //     target: 'map1',
            //     layers: defaultLayers,
            //     view: defaultView,
            //     controls: [
            //         new FullScreen()
            //     ],
            // })
            // var terrain = new Elevation({
            //     source: new XYZ({
            //         url: 'https://assets.agi.com/stk-terrain/v1/tiles/4326/{z}/{x}/{y}.png',
            //         crossOrigin: 'anonymous',
            //     })
            // })
            // map.value.addLayer(terrain)
        }
        onMounted(() => {
            initMap()
            // let Cesium = require('cesium/Source/Cesium')
            // var viewer = new Viewer("map1",{
            //     infoBox: false
            // })
            var viewer = new Viewer("map1",{
                infoBox: false
                // camera:
            })
            viewer.camera.flyTo({
                // [120.971859, 24.801583]
                destination : Cartesian3.fromDegrees(120.971859, 24.801583, 100)
            })

            let iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0]
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popus allow-forms')
            iframe.setAttribute('src', '')

            const ol3d = new OLCesium({map: map1.value}); // ol2dMap is the ol.Map instance
            ol3d.setEnabled(true);
            ol3dLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }))
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
    <div class="w-100 d-flex flex-nowrap mapWrap" id="mapWrap">
    </div>
</template>

<style lang="sass" scoped>
#map1
    height: 100vh
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
