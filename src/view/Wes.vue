<script setup>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { ImageArcGISRest, OSM } from 'ol/source.js'
import Projection from 'ol/proj/Projection.js'
import TileWMS from 'ol/source/TileWMS'

import baseMapList from '@/config/baseMapList'

import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import OLCesium from 'olcs/OLCesium.js';
onMounted(() => {
    // 在元素加载完之后再执行地图初始化
    // initMap()
    const baseMaps = baseMapList
    let newTileLayer = baseMaps.sourceFun('imagery')
    console.log(newTileLayer)
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
    olmap.on('click', (evt) => {
        const coordinate = evt.coordinate;
        console.log(coordinate)

        const resolution = olmap.getView().getResolution();
        const projection = getProjection('EPSG:4326')
        console.log(resolution, projection)
        // const source = targetLayer.getSource()
        // const tileGrid = source.getTileGrid();

        // // Get the tile coordinate for the given coordinate and resolution
        // const tileCoord = tileGrid.getTileCoordForCoordAndResolution(coordinate, resolution);

        // // Manually construct the GetFeatureInfo URL
        // const url = source.getTileUrl(tileCoord, 1, projection);


        // const test = olmap.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        //     return feature
        // })
        // console.log('test', test)

        // const data = targetLayer.getData(evt.pixel)
        // console.log(evt.pixel, data)

        // const features = []

        // const tileGrid = source.getTileGrid()
        // const tileCoord = source.getTileCoord(evt.pixel)
        // const tileExtent = tileGrid.getTileCoordExtent(tileCoord)


        // if (targetLayer instanceof ol.layer.Tile) {
        //     const source = targetLayer.getSource();
        //     const tileGrid = source.getTileGrid();
        //     const tileCoord = source.getTileCoordForPixel(pixel);
        //     const tileExtent = tileGrid.getTileCoordExtent(tileCoord);
        //     console.log(source, tileGrid, tileCoord, tileExtent)
        //     // tileExtent 即为色块的范围
        // }

        // needfix: 已抓入圖層.需要加入後續事件小視窗及後續另開連結事件
        // if (data[0]) {
        //     console.log(evt.pixel)
        //     const source = targetLayer.getSource()
        //     console.log('source', source)
        //     console.log('getTileGrid', source.getTileGrid())
        //     // 获取色块的范围
        //     var extent = clickedFeature.getGeometry().getExtent()

        //     // 判断点击位置是否在色块的范围内
        //     var isInside = ol.extent.containsCoordinate(extent, coordinate)
        // }

        // var coordinate = evt.coordinate;
        // var pixel = target.getPixelFromCoordinate(coordinate);
        // var features = targetLayer.getSource().getFeaturesAtCoordinate(coordinate);
        // if (features.length > 0) {
        //     var properties = features[0].getProperties();
        //     console.log(properties)
        //     // 在這裡對要素的屬性進行處理
        // }
    })

    // const ol3d = new OLCesium({
    //     map: olmap,
    // })
    // ol3d.setEnabled(true);
    // // 创建 Cesium 的场景对象
    // var scene = ol3d.getCesiumScene();

    // // 添加 Cesium 的地形提供者
    // let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzM3MWFhYS0xMjNlLTQ3MTMtODFjZS0xZjMzM2I5NGZiYTEiLCJpZCI6MTMwODE4LCJpYXQiOjE2ODQwNzM3Mjl9.UYu4kBialPo19dcvosHzZTpg2BD1zkFQnjCD78YiiYo'

    // Cesium.Ion.defaultAccessToken = accessToken
    // scene.terrainProvider = Cesium.createWorldTerrain()
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