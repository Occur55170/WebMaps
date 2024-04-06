<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'
import { Map, View } from 'ol' // 引入容器绑定模块和视图模块
import XYZ from 'ol/source/XYZ' // 引入XYZ地图格式
import Overlay from 'ol/Overlay'// 引入覆盖物模块
import 'ol/ol.css' // ol提供的css样式（必须引入）
import { ImageArcGISRest, OSM } from 'ol/source.js'
import VectorSource from 'ol/source/Vector.js'
import { Fill, Stroke, Style, Icon } from 'ol/style.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import TileWMS from 'ol/source/TileWMS'
import proj4 from 'proj4';

import { register } from 'ol/proj/proj4.js'
import { transform } from 'ol/proj.js'
import Static from 'ol/source/ImageStatic.js'
import ImageWMS from 'ol/source/ImageWMS.js'
import {getCenter} from 'ol/extent.js'

proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs')
proj4.defs("EPSG:3826", "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs")
// window.Proj4js = {
//     Proj: function(code) {
//       return proj4(Proj4js.defs[code]);
//     },
//     defs: proj4.defs,
//     transform: proj4
//   };


register(proj4);

export default {
    props: {},
    setup(props, { emit }) {
        const mapCom = ref(null)
        const state = reactive({})
        const imageExtent = [-90, -45, 90, 45]
        const addImageExtent = [0, 0, 700000, 1300000]
        const a = [105.03935412100009,31.039717361000044,111.73204131800009,40.43520212000004]


        // 初始化地图
        function initMap() {
            mapCom.value = new Map({
                target: mapCom.value,
                layers: [
                    new TileLayer({
                        preload: Infinity,
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    projection: 'EPSG:4326',
                    center: [121.326776, 24.655499],
                    zoom: 10,
                }),
            })
            // const source = new OSM();

            // const layer = new TileLayer();

            // const map = new Map({
            // layers: [layer],
            // target: 'map',
            // view: new View({
            //     center: [0, 0],
            //     zoom: 2,
            // }),
            // });

            // document.getElementById('set-source').onclick = function () {
            // layer.setSource(source);
            // };

            // document.getElementById('unset-source').onclick = function () {
            // layer.setSource(null);
            // };
        }

        function add() {
            const imageLayer = new ImageLayer({
                source: new Static({
                    url: 'https://api.edtest.site/maxdbz/202311190510-202311190520_Maxdbz_map.png',
                    projection: 'EPSG:4326',
                    // [119.18, 21.45, 124.34, 26.56]
                    // imageExtent: [95.03935412100009,21.039717361000044,101.73204131800009,30.43520212000004],
                    imageExtent:  [119.18, 21.45, 124.34, 26.56],
                    interpolate: true,
                })
            })
            mapCom.value.addLayer(imageLayer)

        }
        function bdd() {
            const imageLayer = new ImageLayer({
                preload: Infinity,
                source: new Static({
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/British_National_Grid.svg/2000px-British_National_Grid.svg.png',
                    projection: 'EPSG:27700',
                    imageExtent: addImageExtent,
                    interpolate: true,
                })
            })
            mapCom.value.addLayer(imageLayer)

        }
        function show() {
            console.log(mapCom.value.getLayers().getArray())
        }
        // 获取图层的数据源
        onMounted(() => {
            // 在元素加载完之后再执行地图初始化
            initMap()
        })

        return {
            state,
            props,
            mapCom,
            show,
            add,
            bdd,
        }
    }

}
</script>
<template>
    <button @click="show()">show</button>
    <button @click="add()">add</button>
    <button @click="bdd()">bdd</button>
    <!-- 地图容器 -->
    <div id="map" class="mapCom" ref="mapCom"></div>
</template>
<style>
.mapCom {
    width: 100%;
    height: 800px;
}
</style>
