<script setup>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'

import { Map, View } from 'ol' // 引入容器绑定模塊和視圖模塊
import Tile from 'ol/layer/Tile' // 瓦片加载器
import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊
import { fromLonLat } from 'ol/proj'
import 'ol/ol.css' // ol提供的css样式（必须引入）

const mapCom = ref(null) // 地圖容器
const popupCom = ref(null) // 彈跳視窗容器
const map = ref(null) // 地圖實例
const overlay = ref(null) // 覆蓋物實例
const currentCoordinate = ref('') // 彈跳視窗信息

let state = {
    lang:120.971859,
    lon: 24.801583
}

const view = new View({
    projection: 'EPSG:4326', // 投影座標系
    center: [state.lang, state.lon],
    zoom: 17,
});

// 初始化地圖
function initMap() {
    // 註冊一個覆蓋物
    overlay.value = new Overlay({
        element: popupCom.value, // 彈跳視窗标签，在html里
        autoPan: true, // 如果彈跳視窗在底圖邊緣时，底圖會移動
        autoPanAnimation: { // 底圖移動動畫
            duration: 250
        }
    })
    map.value = new Map({
        target: mapCom.value,
        layers: [ // 圖層
            new Tile({
                name: 'defaultLayer',
                // source: new XYZ({ // 瓦片底圖地址
                //     url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
                // }),
                source: new OSM() // 圖層數據
            })
        ],
        view: view,
        overlays: [overlay.value] // 绑定一個覆蓋物
    })

    mapClick() // 在地圖初始化完成後再绑定點擊事件
}

// 點擊地圖事件
function mapClick() {
    map.value.on('singleclick', evt => { // 绑定一個點擊事件
        const coordinate = evt.coordinate // 獲取座標
        currentCoordinate.value = coordinate // 保存座標点
        overlay.value.setPosition(coordinate) // 設置覆蓋物出现的位置
    })
}

// 關閉彈跳視窗
function closePopup() {
    overlay.value.setPosition(undefined) // setPosition 传入undefined會隐藏彈跳視窗元素
    currentCoordinate.value = '' // 把彈跳視窗内容清空
}


function moveCurrentPosition() {
    navigator.geolocation.getCurrentPosition(function (pos) {
        const coords = fromLonLat([pos.coords.longitude, pos.coords.latitude]);
        view.animate({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 17,
            duration: 100,
        });
    })
}

onMounted(() => {
    initMap()
})
</script>

<template>
    <div class="" @click="moveCurrentPosition">定位</div>
    <!-- 地圖容器 -->
    <div id="map" class="map__x" ref="mapCom"></div>

    <!-- 彈跳視窗容器 -->
    <div ref="popupCom" class="popup">
        <!-- 關閉按钮 -->
        <span class="icon-close" @click="closePopup">✖</span>
        <!-- 彈跳視窗内容（展示座標信息） -->
        <div class="content">{{ currentCoordinate }}</div>
    </div>
    <div class="" @click="moveCurrentPosition">123</div>
</template>

<style lang="sass">
.map__x
    width: 100vw
    height: 100vh
    border: 1px solid #eee

.ol-zoom
    left: unset
    right: 0
    top: 50%
    z-index: 220

.popup
    width: 300px
    height: 100px
    background: #fff
    position: absolute
    top: -115px
    left: -150px
    box-sizing: border-box
    padding: 10px

    &::after
        content: ''
        display: block
        position: absolute
        width: 20px
        height: 20px
        background: #fff
        bottom: -10px
        left: 50%
        transform: translateX(-50%) rotate(45deg)

    .icon-close
        position: absolute
        top: 0px
        right: 8px
        cursor: pointer

    .content
        margin-top: 14px
</style>
