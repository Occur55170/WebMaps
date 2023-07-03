<template>
    <button @click="show()">show</button>
    <button @click="add()">add</button>
    <!-- 地图容器 -->
    <div id="map" class="map__x" ref="mapCom"></div>
</template>

<script setup>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'
import { Map, View } from 'ol' // 引入容器绑定模块和视图模块
import XYZ from 'ol/source/XYZ' // 引入XYZ地图格式
import Overlay from 'ol/Overlay'// 引入覆盖物模块
import 'ol/ol.css' // ol提供的css样式（必须引入）
import { ImageArcGISRest, OSM } from 'ol/source.js'
import VectorTileLayer from 'ol/layer/VectorTile.js'
import VectorTileSource from 'ol/source/VectorTile.js'
import TileGrid from 'ol/tilegrid/TileGrid.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import ImageWMS from 'ol/source/ImageWMS.js'

import VectorSource from 'ol/source/Vector.js'
import { Fill, Stroke, Style, Icon } from 'ol/style.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import TileWMS from 'ol/source/TileWMS'
import proj4 from 'proj4';

import { createXYZ } from 'ol/tilegrid.js'
import { getCenter, getWidth } from 'ol/extent.js'
import { get as getProjection, transformExtent, fromLonLat } from 'ol/proj.js'
import { register } from 'ol/proj/proj4.js'
import { transform } from 'ol/proj.js'


proj4.defs(
  'EPSG:3826',
  '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
);
register(proj4);

const mapCom = ref(null) // 地图容器
const map = ref(null) // 地图实例


const aLayer = new Tile({
    preload: Infinity,
    source: new XYZ({
        url: 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{z}/{y}/{x}'
    }),
    crossOrigin: 'anonymous',
})

const newLayer = new TileLayer({
    source: new TileWMS({
        name: '順向坡分布',
        url: 'https://dwgis1.ncdr.nat.gov.tw/server/services/MAP0627/Map2022EGDebrisSlide/MapServer/WMSServer',
        params: {
            'REQUEST': 'GetMap',
            'SERVICE': 'WMS',
            'VERSION': '1.1.1',
            'LAYERS': '2',
            'STYLES': '',
            'FORMAT': 'image/png',
            'BGCOLOR': '0xFFFFFF',
            'TRANSPARENT': 'TRUE',
            'SRS': 'EPSG:3826'
        },
        crossOrigin: 'anonymous',
        projection: 'EPSG:3826',
    }),
})

const bLayer = new TileLayer({
    source: new TileWMS({
        // projection: 'EPSG:3857', // here is the source projection
        url: 'https://ahocevar.com/geoserver/wms',
        params: {
            'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
        },
    }),
})

const area = reactive({
  India: [68.17665, 7.96553, 97.40256, 35.49401],
  Argentina:[-73.41544, -55.25, -53.62835, -21.83231],
  Nigeria: [2.6917, 4.24059, 14.57718, 13.86592],
  Sweden: [11.02737, 55.36174, 23.90338, 69.10625],
  Taiwan: [119.5, 20.5, 124.5, 25.5], // 台湾的 Extent
})

// 初始化地图
function initMap() {
    map.value = new Map({
        extent: area.Taiwan,
        target: mapCom.value,
        layers: [
            new TileLayer({
                preload: Infinity,
                source: new OSM(),
            }),
            // newLayer
        ],
        view: new View({
            projection: 'EPSG:4326',
            center: [120.41670777208755, 24.197957034875305],
            zoom: 10,
        }),
    })
}

function show() {
    // 获取图层的数据源
    console.log(map.value.getLayers())
    const source = map.value.getLayers();
    // 获取图层的投影属性
    // const projection = source[1].getSource();

    // console.log(projection);
}
// features: (new GeoJSON({
//     dataProjection: 'EPSG:3826',
//     featureProjection: map.value.getView().getProjection(),
// })).readFeatures(geojsonObject)
// features: (new GeoJSON()).readFeatures(geojsonObject, {
//     dataProjection: 'EPSG:3006',
//     featureProjection: map.getView().getProjection()
// })


function add() {
    map.value.addLayer(newLayer)
}

onMounted(() => {
    // 在元素加载完之后再执行地图初始化
    initMap()
})
</script>

<style lang="scss" scoped>
.map__x {
    width: 100vw;
    height: 100vh;
    border: 1px solid #eee;
}

.popup {
    width: 300px;
    height: 100px;
    background: #fff;
    position: absolute;
    top: -115px;
    left: -150px;
    box-sizing: border-box;
    padding: 10px;

    &::after {
        content: '';
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        background: #fff;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
    }

    .icon-close {
        position: absolute;
        top: 0px;
        right: 8px;
        cursor: pointer;
    }

    .content {
        margin-top: 14px;
    }
}
</style>
