<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM'
// import {VectorSource, XYZ} from 'ol/source.js';
import { Vector as VectorSource, XYZ } from 'ol/source.js';
import { Icon, Style } from 'ol/style.js'
import { Image as ImageLayer, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import 'ol-ext/dist/ol-ext.css';
import Permalink from 'ol-ext/control/Permalink.js';
import { FullScreen, defaults as defaultControls } from 'ol/control.js';
// import { format } from 'path';
import {GPX, GeoJSON, IGC, KML, MVT, TopoJSON} from 'ol/format.js';
import render3D from 'ol-ext/layer/Render3D';

// import ignf from '../assets/data'

// import target from './data/target.png'
import ignf from '../data/ignf.json'

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


            // // Create layer
            var vectorSource = new VectorSource({
                url: '/data/ignf.json',
                // projection: 'EPSG:3857',
                format: new GeoJSON(),
            });
            var vector = new Vector({
                source: vectorSource,
                maxResolution: 2
            });
            map.value.addLayer(vector);

            var dbpSource = new VectorSource({
                url: '/data/dbpedia.json',
                format: new GeoJSON(),
            });
            var dbp = new Vector({
                source: dbpSource
            });
            map.value.addLayer(dbp);

            // Set 3D renderer
            var r3D = new render3D({
                height: 0,
                maxResolution: 0.6,
                defaultHeight: 3.5
            });
            vector.setRender3D(r3D);
            var listenerKey = vectorSource.on('change', function (e) {
                if (vectorSource.getState() == 'ready') {
                    Observable.unByKey(listenerKey)
                    $(".loading").hide();
                    setTimeout(doAnime, 200);
                }
            });
            var r3D2 = new render3D({ height: 100, maxResolution: 10 });
            dbp.setRender3D(r3D2);

            var height = 0;
            function doAnime() {
                if (r3D.animating()) return;
                r3D2.animate({ height: height ? 0 : 100 });
                height = height ? 0 : "HAUTEUR";
                r3D.animate({ height: height });
            }
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
