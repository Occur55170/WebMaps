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
import Overlay from 'ol/Overlay.js';

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
                nodeRef: null,
                overlay: null,
                tribeAreaData: {},
            },
            comHeight: {
                wrapHeight: '',
                mapHeight: '',
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
            })
            state.map1.getLayers().getArray()[0].setOpacity(0.5)
            console.log()
        }

        onMounted(()=>{
            initMap()
        })

        return {
            state,
            props,
        }
    }
}
</script>

<template>
    <div>
        <div id="map1" style="height: 100vh;width: 100vw;"></div>
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
    top: 20px
    left: 20px
    z-index: 220
.conditionCom
    width: 480px
    right: 1%
    bottom: 5%
.middleLine
    width: 5px
    background: $blue-steel
.areaData
    width: 450px
    max-height: 500px
    background: #fff
    box-sizing: border-box
#popup
    border: 1px solid #088
    border-radius: 10px
    background-color: #0FF



@media (max-width: 600px)
    .m-Navbar
        z-index: 222
    .middleLine
        height: 1px
        width: 100%
</style>
