<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'
import { Map, View, Feature } from 'ol'
import { ImageArcGISRest, OSM } from 'ol/source.js'
import TileWMS from 'ol/source/TileWMS'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊
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
import { tile as tileStrategy } from 'ol/loadingstrategy.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import Projection from 'ol/proj/Projection.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import VectorImageLayer from 'ol/layer/VectorImage.js';
import TileState from 'ol/TileState.js';
import 'ol/ol.css'
import baseMapList from '@/config/baseMapList'
import 'ol-ext/dist/ol-ext.css'
import { get as getProjection } from 'ol/proj';

import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'

import OLCesium from 'olcs/OLCesium.js'
export default {
    props: {},
    setup(props, { emit }) {
        const state = reactive({
            map1: null,
            map2: null,
            defaultCenter: [121.326776, 24.655499],
            defaultCenterZoom: 14,
        })
        const defaultView = new View({
            projection: 'EPSG:4326',
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
        })
        const osm = new TileLayer({
            source: new OSM(),
        })
        onMounted(async () => {
            const api = 'http://gis.edtest.site:8010/ogc/temp?LAYER=%E6%96%B0%E7%AB%B9%E7%B8%A3%E5%8E%9F%E4%BD%8F%E6%B0%91%E9%83%A8%E8%90%BD%E7%AF%84%E5%9C%8D&REQUEST=GetMap&SERVICE=WMS&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:3826&VERSION=1.1.1&FORMAT=image/png&STYLES='
            const url = new URL(api);
            // 取得網址部分
            const origin = url.origin
            const pathname = url.pathname
            // 取得query參數
            const searchParams = url.searchParams;
            const searchParamsObject = {};
            for (const [key, value] of searchParams.entries()) {
                searchParamsObject[key] = value;
            }
            const braster = new TileLayer ({
                source: new TileWMS({
                    url: origin + pathname,
                    params: searchParamsObject,
                    serverType: 'geoserver',
                    // 需要開啟此
                    // crossOrigin: 'anonymous',
                })
            })
            state.map1 = new Map({
                target: 'map1',
                layers: [
                    new TileLayer({
                    source: new OSM(),
                    }),
                    braster
                ],
                view: defaultView,
                controls: [],
            })


            let ol3d = null
            Cesium.Ion.defaultAccessToken = import.meta.env.VITE_Ol3D_TOKEN
            
                ol3d = new OLCesium({
                    map: state.map1,
                    time() {
                        return Cesium.JulianDate.now();
                    }
                })
                ol3d.setEnabled(true)
                // let scene = ol3d.getCesiumScene()
                // scene.terrainProvider = Cesium.createWorldTerrain({})
        })
        function showLayer() {
            console.log(state.map1.getLayers().getArray())
        }
        return {
            state,
            showLayer
        }
    }
}
</script>
<template>
    000
    <div @click="showLayer">show</div>
    <div id="map1" class="map"></div>
    8999
</template>
<style>
.map {
    width: 800px;
    height: 800px;
}
</style>