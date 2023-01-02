<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'

import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
import Tile from 'ol/layer/Tile' // 瓦片加载器
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊

import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Style } from 'ol/style.js'
import { Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import {Image as ImageLayer} from 'ol/layer.js';
import ImageWMS from 'ol/source/ImageWMS'
import {FullScreen, defaults as defaultControls} from 'ol/control.js';


import 'ol/ol.css' // ol提供的css样式（必须引入）
import riverpoly from '../assets/img/riverpoly.jpg'


export default {
    props: {
    },
    setup(props, { emit }) {
        const state = reactive({
            defaultCenter: [120.971859, 24.801583], //lng, lat
            defaultCenterZoom: 17,
        })
        const mapCom = ref(null) // 地圖容器
        const map = ref(null) // 地圖實例
        const compassBox = ref(null) // 覆蓋物實例

        const defaultLayers = [ // 圖層
            new Tile({
                name: 'defaultLayer',
                source: new OSM() // 圖層數據
            }),
            // new ImageLayer({
            //     extent: [120.971859, 24.801583],
            //     source: new ImageWMS({
            //         url: riverpoly,
            //         ratio: 1,
            //         projection: 'EPSG:4326'
            //     })
            // })
        ];

        const defaultView = new View({
            projection: 'EPSG:4326', // 投影座標系
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
            // 測試用
            rotation:1
        });

        compassBox.value = new Overlay({
            element: compassBox.value,
            positioning: 'center-center',
            stopEvent: false
        })


        // 初始化地圖
        function initMap() {
            map.value = new Map({
                target: mapCom.value,
                layers: [...defaultLayers],
                view: defaultView,
                overlays: [
                    compassBox.value,
                ], // 绑定一個覆蓋物
                controls: [
                    new FullScreen()
                ]
            })

            // let layer= new ImageLayer({
            //     source: new ImageWMS({
            //         url: riverpoly,
            //         params: {'LAYERS': 'your-image'},
            //         serverType: 'geoserver'
            //     }),
            //     extent: [0, 0, 100, 100]  // 圖層的經緯度範圍
            // })
            // map.value.addLayer(layer)
            // const view = map.value.getView();
            // const extent = [0, 0, 100, 100];  // 自定義圖層的經緯度範圍
            // view.fit(extent, {
            //     size: map.value.getSize(),  // 將地圖视图設置到可視窗口大小
            //     padding: [20, 20, 20, 20]  // 設置地圖邊界的間距
            // });

        }


        // 地圖旋轉事件
        function mapRotate() {
            map.value.on('rotate', evt => {
                // const coordinate = evt.coordinate // 獲取座標
                // currentCoordinate.value = coordinate // 保存座標点
                // coordinateBox.value.setPosition(coordinate) // 設置覆蓋物出现的位置
                // 獲取地圖目前的旋轉程度
                var rotation = map.getView().getRotation();

                // 轉動遮照
                shadowLayer.getSource().rotate(rotation);
            });
        }

        function addPoint(targetLng, targetLat) {
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

        // 移動到當前位置
        function moveCurrentPosition() {
            navigator.geolocation.getCurrentPosition(function (pos) {
                defaultView.animate({
                    center: [pos.coords.longitude, pos.coords.latitude],
                    zoom: 17,
                    duration: 100,
                });
                addPoint(pos.coords.longitude, pos.coords.latitude)
            })
        }

        function zoomIn() {
            let zoom = defaultView.getZoom()
            defaultView.animate({
                zoom: zoom + 1,
            })
        }

        function zoomOut() {
            let zoom = defaultView.getZoom()
            defaultView.animate({
                zoom: zoom - 1,
            })
        }

        function toNorth() {
            defaultView.animate({
                rotation: 0,
            })
        }

        onMounted(() => {
            initMap()
            nextTick(()=>{
                mapRotate()
            })
        })

        return {
            state,
            mapCom,
            moveCurrentPosition,
            zoomIn,
            zoomOut,
            toNorth,
            riverpoly
        }
    }
}
</script>

<template>
    <!-- 地圖容器 -->
    <div id="map" class="map__x" ref="mapCom"></div>

    <div class="asideTool">
        <div class="" @click="moveCurrentPosition">定位</div>
        <div class="" @click="zoomIn">放大</div>
        <div class="" @click="zoomOut">縮小</div>
    </div>
    <div ref="compassBox" class="compass" @click="toNorth">
        <img src="https://cdn.pixabay.com/photo/2012/04/02/15/57/right-24825_1280.png" alt="Compass">
    </div>
</template>

<style lang="sass" scoped>
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

// 指北針範例用 需修改
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
.ol-full-screen button
    width: 50px
    height: 50px
</style>
