<script setup>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'


import OLCesium from 'olcs/OLCesium.js';
onMounted(() => {
    // 在元素加载完之后再执行地图初始化
    // initMap()
    var olmap = new Map({
        name: 'default',
        target: 'cesiumContainer',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        view: new View({
            projection: 'EPSG:4326',
            center: [120.971859, 24.801583],
            zoom: 14
        })
    })
    const ol3d = new OLCesium({
        map: olmap,
    })
    ol3d.setEnabled(true);

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
