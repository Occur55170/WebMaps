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

import OLCesium from 'olcs/OLCesium.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
import TileState from 'ol/TileState.js';

import 'ol/ol.css'

import mapLayerList, { initLayers, tribeIdList, getTribeData } from '@/config/mapLayerList'
import baseMapList from '@/config/baseMapList'

import 'ol-ext/dist/ol-ext.css'

import { get as getProjection } from 'ol/proj';

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


        // 監聽地圖點擊事件
        // target.on('click', (evt) => {
        //     const feature = state.map1.forEachLayerAtPixel(evt.pixel, function (feature, layer) {
        //         return feature
        //     })
        //     if (feature) {
        //         // const coordinate = evt.coordinate
        //         // state.areaDataId = feature.get('name')
        //         // overlay.value.setPosition(coordinate)
        //     }
        // })
        // let newTileLayer = mapLayers[value.layerName]()
        // if (Array.isArray(newTileLayer)) {
        //     newTileLayer.forEach(node=>{
        //         target.addLayer(node)
        //     })
        //     // 點擊事件
        //     target.on('click', function (evt) {
        //         const feature =target.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        //             return feature
        //         })
        //         if (feature) {
        //             const coordinate = evt.coordinate
        //             state.areaDataId = feature.get('name')
        //             overlay.value.setPosition(coordinate)
        //         } else {
        //             overlay.value.setPosition(undefined)
        //         }
        //     })
        //     target.addOverlay(overlay.value)
        // } else {
        //     target.addLayer(newTileLayer)
        // }

        // 點擊事件
        // forEachFeatureAtPixel
        // forEachLayerAtPixel
        // forEachFeatureAtPixel

        onMounted(async () => {
            let a = '%E6%96%B0%E7%AB%B9%E7%B8%A3%E5%8E%9F%E4%BD%8F%E6%B0%91%E9%83%A8%E8%90%BD%E7%AF%84%E5%9C%8D'
            let b = window.encodeURI('新竹縣原住民部落範圍')
            // LAYER=
            // %E6%96%B0%E7%AB%B9%E7%B8%A3%E5%8E%9F%E4%BD%8F%E6%B0%91%E9%83%A8%E8%90%BD%E7%AF%84%E5%9C%8D
            // &REQUEST=GetMap&SERVICE=WMS&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:3826&VERSION=1.1.1&FORMAT=image/png&STYLES=",
            console.log(a === b)
            // http://gis.edtest.site:8010/ogc/temp?LAYER=新竹縣原住民部落範圍&REQUEST=GetMap&SERVICE=WMS&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:3826&VERSION=1.3.0&FORMAT=image/png&STYLES=
            const wmsSource = new TileWMS({
                url: 'http://gis.edtest.site:8010/ogc/temp',
                params: {
                    'LAYER': '新竹縣原住民部落範圍',
                    // 'LAYER': '%E6%96%B0%E7%AB%B9%E7%B8%A3%E5%8E%9F%E4%BD%8F%E6%B0%91%E9%83%A8%E8%90%BD%E7%AF%84%E5%9C%8D',
                    'REQUEST': 'GetMap',
                    'SERVICE': 'WMS',
                    'BGCOLOR': '0xFFFFFF',
                    'TRANSPARENT': 'TRUE',
                    'SRS': 'EPSG:4326',
                    'VERSION': '1.3',
                    'FORMAT': 'image/png',
                    'STYLES': '',
                },
                serverType: 'geoserver'
            })

            const braster = new TileLayer ({
                source: wmsSource
            })


            state.map1 = new Map({
                target: 'map1',
                layers: [baseMapList.sourceFun('default'), braster],
                view: defaultView,
                controls: [],
            })

            state.map1.on('click', (evt)=>{
                console.log(evt)
                const feature = state.map1.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                    return feature
                })
                if (feature) {
                    // needfix: 已抓入圖層.需要加入後續事件小視窗及後續另開連結事件
                    console.log('Feature')
                }
            })
        })

        function showLayer() {
            console.log(state.map1.getLayers().getArray())
        }

        return {
            state,
            showLayer
            // map
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
