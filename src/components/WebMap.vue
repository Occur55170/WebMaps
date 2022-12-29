<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'

import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
import Tile from 'ol/layer/Tile' // 瓦片加载器
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊
import { fromLonLat } from 'ol/proj'

import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Style } from 'ol/style.js'
import { Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
// import {Control, defaults as defaultControls} from 'ol/control.js';

import 'ol/ol.css' // ol提供的css样式（必须引入）

import AsideTool from './AsideTool.vue'

export default {
  setup(props, { emit }){
    const state=reactive({
        lng: 120.971859,
        lat: 24.801583
    })
    const mapCom = ref(null) // 地圖容器
    const popupCom = ref(null) // 彈跳視窗容器
    const map = ref(null) // 地圖實例
    const overlay = ref(null) // 覆蓋物實例
    const compass = ref(null) // 覆蓋物實例
    const currentCoordinate = ref('') // 彈跳視窗信息

    const view = new View({
        projection: 'EPSG:4326', // 投影座標系
        center: [state.lng, state.lat],
        zoom: 17,
        rotation: 1,
    });

    // 初始化地圖
    function initMap() {
        // 註冊一個覆蓋物
        overlay.value = new Overlay({
            element: popupCom.value, // 彈跳視窗標籤，在html里
            autoPan: true, // 如果彈跳視窗在底圖邊緣时，底圖會移動
            autoPanAnimation: { // 底圖移動動畫
                duration: 250
            }
        })
        compass.value = new Overlay({
            element: compass.value,
            positioning: 'center-center',
            stopEvent: false
        });
        // map.addOverlay(compass);
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
            overlays: [
                overlay.value,
                compass.value,
            ], // 绑定一個覆蓋物
            //地圖小工具可以縮小視窗
            controls: [],
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

    function addPoint(targetLng, targetLat){
        const marker = new Vector({
            source: new VectorSource({
                features: [
                    new Feature({
                        geometry: new Point([targetLng, targetLat]),
                        name: 'Null Island',
                        population: 4000,
                        rainfall: 500,
                    })
                ]
            }),
            style: new Style({
                image: new Icon({
                    anchor: [0.5, 100],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    // 圖片連結需修改
                    src: 'https://www.ockert-cnc.de/wp-content/uploads/2016/12/map-marker-icon-100x100.png',
                }),
            })
        })
        map.value.addLayer(marker);
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
            addPoint(pos.coords.longitude, pos.coords.latitude)
        })
    }

    function zoomIn() {
        let view = map.value.getView() // 获取当前视图
        let zoom = view.getZoom() // 获取当前缩放级别
        view.setZoom(zoom + 1)
    }

    function zoomOut() {
        let view = map.value.getView() // 获取当前视图
        let zoom = view.getZoom() // 获取当前缩放级别
        view.setZoom(zoom - 1)
    }

    onMounted(() => {
        initMap()
    })

    return {
        state,
        mapCom,
        popupCom,
        currentCoordinate,
        mapClick,
        closePopup,
        moveCurrentPosition,
        zoomIn,
        zoomOut
    }
  }
}
</script>

<template>
    <!-- 地圖容器 -->
    <div id="map" class="map__x" ref="mapCom"></div>

    <!-- 彈跳視窗容器 -->
    <div class="popup" ref="popupCom">
        <!-- 關閉按钮 -->
        <span class="icon-close" @click="closePopup">✖</span>
        <!-- 彈跳視窗内容（展示座標信息） -->
        <div class="content">{{ currentCoordinate }}</div>
    </div>
    <!-- <AsideTool class="asideTool" /> -->
    <div ref="compass" class="compass">
        <img src="https://cdn.pixabay.com/photo/2012/04/02/15/57/right-24825_1280.png" alt="Compass">
    </div>
    <div class="asideTool">
        <div class="" @click="moveCurrentPosition">定位</div>
        <div class="" @click="zoomIn">放大</div>
        <div class="" @click="zoomOut">縮小</div>
    </div>
</template>

<style lang="sass">
.map__x
    width: 100vw
    height: 100vh
    border: 1px solid #eee

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

// 範例用 需修改
.compass
    position: absolute
    right: 0
    bottom: 0
    width: 100px
    height: 100px
    transform: rotateZ(-90deg)
    img
        width: 100%
        height: 100%

.ol-rotate.ol-hidden
    opacity: 1 !important
    visibility: unset !important
.ol-rotate-reset
    width: 60px !important
    height: 60px !important

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
