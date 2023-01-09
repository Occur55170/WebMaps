<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'
import { Map, View } from 'ol';
import OlCesium from 'ol-cesium';
import { Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import OSM from 'ol/source/OSM'

const map = new Map({
    target: 'map',
    layers: [
        // Add your layers here
    ],
    view: new View({
        center: [0, 0],
        zoom: 2
    })
});

const olCesium = new OlCesium({ map: map });
olCesium.add3DModel({
    url: 'path/to/model.gltf',
    position: [0, 0, 0]
});

</script>

<template>
    <div>
        <!-- 地圖容器 -->
        <div class="w-100 d-flex flex-nowrap mapWrap" id="mapWrap">
            <div id="map" ref="mapCom"></div>
        </div>
    </div>
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
