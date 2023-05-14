<script setup>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'

import XYZ from 'ol/source/XYZ'

// imagery
// let newTileLayer = baseMaps.sourceFun(value.layerName)
// targetLayers.extend([newTileLayer])

import mapLayerList from '@/config/mapLayerList'
import baseMapList from '@/config/baseMapList'

import OLCesium from 'olcs/OLCesium.js';
onMounted(() => {
    // 在元素加载完之后再执行地图初始化
    // initMap()
    const key = 'Gu2rcfenfMEKjKXgPF6H'
    const baseMaps = baseMapList
    let newTileLayer = baseMaps.sourceFun('imagery')
    var olmap = new Map({
        name: 'default',
        target: 'cesiumContainer',
        // layers: [
        //     // new TileLayer({
        //     //     source: new OSM(),
        //     // }),
        //     new XYZ({
        //         url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + 'Gu2rcfenfMEKjKXgPF6H',
        //         crossOrigin: 'anonymous'
        //     }),
        // ],
        layers: [newTileLayer],
        view: new View({
            projection: 'EPSG:4326',
            center: [120.971859, 24.801583],
            zoom: 14
        })
    })
    // let newTileLayer = baseMaps.sourceFun(value.layerName)

    const ol3d = new OLCesium({
        map: olmap,
    })
    ol3d.setEnabled(true);
    // 创建 Cesium 的场景对象
    var scene = ol3d.getCesiumScene();

    // 添加 Cesium 的地形提供者
    let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzM3MWFhYS0xMjNlLTQ3MTMtODFjZS0xZjMzM2I5NGZiYTEiLCJpZCI6MTMwODE4LCJpYXQiOjE2ODQwNzM3Mjl9.UYu4kBialPo19dcvosHzZTpg2BD1zkFQnjCD78YiiYo'

    Cesium.Ion.defaultAccessToken = accessToken
    scene.terrainProvider = Cesium.createWorldTerrain({
        // accessToken: accessToken,
        // requestWaterNask: true,
        // requestVertexNormals: true
    });
})
</script>
<template>
    <div id="cesiumContainer" class="cesiumContainer"></div>
</template>

<style>
.cesiumContainer {
    width: 100%;
    height: 100vh;
}
</style>