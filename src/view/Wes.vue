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

import mapLayerList, { initLayers, tribeIdList } from '@/config/mapLayerList'
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
            const circleFeature = new Feature({
                    name: 'DimensionMap',
                    title: 'DimensionMap',
                    geometry: new Circle([121.326776, 24.655499], 0.005),
            })
            const coordinates = [
                [120.971859, 24.801583],
                [120.970000, 24.809583],
                [120.985000, 24.808583],
                [120.990000, 24.806583],
                [120.971859, 24.801583]
            ]

            const areaLineLayer = new Vector({
                name: 'DimensionMap',
                title: 'DimensionMap',
                source: new VectorSource({
                    features: [new Feature({
                        name: 'areaLineLayer',
                        title: 'areaLineLayer',
                        geometry: new Circle([121.326776, 24.655499], 0.005),
                    })],
                }),
                style: new Style({
                    fill: new Fill({
                        color: '#0f9ce2'
                    }),
                })
            })

            state.map1 = new Map({
                target: 'map1',
                layers: [baseMapList.sourceFun('default'), areaLineLayer],
                view: defaultView,
                controls: [],
            })
        })

        return {
            state,
            // map
        }
    }
}


</script>

<template>
    000
    <div id="map1" class="map"></div>
    8999

</template>

<style>
.map {
    width: 800px;
    height: 800px;
}
</style>
