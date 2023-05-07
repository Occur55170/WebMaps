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

import mapLayerList, { initLayers, getTribeData } from '@/config/mapLayerList'
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

        // https://gis.stackexchange.com/questions/179114/error-when-trying-to-get-a-click-event-on-wms-layer
        // function findFeaturesAtLocationOnClick(event) {
        //     mouseLocation = map.getLonLatFromPixel(event.xy);
        //     var url = events.getFullRequestString(
        //         {
        //             REQUEST: "GetFeatureInfo",
        //             EXCEPTIONS: "application/vnd.ogc.se_xml",
        //             BBOX: map.getExtent().toBBOX(),
        //             X: event.xy.x,
        //             Y: event.xy.y,
        //             INFO_FORMAT: 'text/plain',
        //             QUERY_LAYERS: 'events',
        //             FEATURE_COUNT: 100,
        //             WIDTH: map.size.w,
        //             HEIGHT: map.size.h
        //         },
        //         wmsURL
        //     );
        //     OpenLayers.loadURL(url, '', this, setPopupHTML);
        // }

        // function setPopupHTML(response) {
            // In this function, the response contains the exception I mentioned above

        // }

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
                    name: 'braster',
                    url: origin + pathname,
                    params: searchParamsObject,
                    serverType: 'geoserver',
                    // 需要開啟此
                    crossOrigin: 'anonymous',
                })
            })


            // const braster = new TileLayer({
            //     source: new TileWMS({
            //         url: 'https://ahocevar.com/geoserver/wms',
            //         params: {'LAYERS': 'ne:ne', 'TILED': true},
            //         serverType: 'geoserver',
            //         crossOrigin: 'anonymous',
            //     }),
            // })


            state.map1 = new Map({
                target: 'map1',
                layers: [baseMapList.sourceFun('default')],
                view: defaultView,
                controls: [],
            })

            state.map1.addLayer(braster)

            state.map1.on('click', (evt)=>{
                let layerList = state.map1.getLayers().getArray()
                let tribeLayer = layerList.filter(node=> node.get('id') == 'node0_subNode3_nestedSubNodeundefined')
                console.log(tribeLayer)
                console.log(braster)
                // const data = tribeLayer.getData(evt.pixel)

                const data = braster.getData(evt.pixel)
                console.log('getData', data)
                state.map1.forEachFeatureAtPixel(evt.pixel, function(layer) {
                    console.log(layer.getSource().getParams().LAYERS)
                })
                // if (feature) {
                //     // needfix: 已抓入圖層.需要加入後續事件小視窗及後續另開連結事件
                //     console.log('Feature')
                // }
            })

            // state.map1.on('pointermove', function (evt) {
            //     if (evt.dragging) {
            //         return;
            //     }
            //     const data = braster.getData(evt.pixel);
            //     console.log(data)
            //     // const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
            //     // state.map1.getTargetElement().style.cursor = hit ? 'pointer' : '';
            // });
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
