<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'

import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import { Map, View, Feature } from 'ol'
import { Tile, Vector } from 'ol/layer.js'
import { Point } from 'ol/geom.js'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Style } from 'ol/style.js'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊
import 'ol/ol.css' // ol提供的css样式（必须引入）
import { fromLonLat } from 'ol/proj'
import { useStore } from 'vuex'

import currentPositionImg from '@/assets/img/icon/currentPosition.svg'


export default {
    props: {},
    setup(props, { emit }){
        const map = ref(null)
        const store = useStore()
        const state = reactive({
            defaultCenter: [120.971859, 24.801583],
            defaultCenterZoom: 14,
        })

        const defaultView = new View({
            // 投影法 表示方法
            projection: 'EPSG:4326',
            // 初始化地圖中心地點
            center: state.defaultCenter,
            // 初始化視圖縮放等級
            zoom: state.defaultCenterZoom,
            // 限制視圖最大縮放等級。預設 28
            maxZoom:26,
            minZoom:1,
            // 旋轉角度
            rotation: 5
        })
        function initMap() {
            map.value = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                        })
                    })
                ],
                view: defaultView,
                // 清空預設地圖控制器
                controls: [],
            });
        }
        function mapControl({ action, value }) {
            let View = map.value.getView()
            switch (action) {
                case 'In':
                    View.animate({
                        zoom: View.getZoom() + 1,
                    })
                    break;
                case 'Out':
                    View.animate({
                        zoom: View.getZoom() - 1,
                    })
                    break;
                case 'toNorth':
                    View.animate({
                        rotation: 0,
                    })
                    break;
                case 'moveTo':
                    if (value) {
                        const { xAxis, yAxis } = value
                        View.animate({
                            center: [xAxis, yAxis],
                            zoom: 17,
                            duration: 100,
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(function (pos) {
                            View.animate({
                                center: [pos.coords.longitude, pos.coords.latitude],
                                zoom: 17,
                                duration: 100,
                            });
                            addPoint(pos.coords.longitude, pos.coords.latitude)
                        })
                    }
                    break;
                case 'fullScreen':
                    let target = document.getElementById(`map`)
                    target.requestFullscreen()
                    break;
            }
        }
        function addPoint(targetLng, targetLat) {
            const marker = new Vector({
                source: new VectorSource({
                    features: [
                        new Feature({
                            geometry: new Point([targetLng, targetLat]),
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
                        src: currentPositionImg,
                    }),
                })
            })

            map.value.addLayer(marker)
        }

        function moveToMap(val) {
            let obj = {
                action: 'moveTo',
                value: {
                    xAxis: val.WGS84.lng,
                    yAxis: val.WGS84.lat
                }
            }
            mapControl(obj)
        }
        onMounted(()=>{
            initMap()
        })
        return {
            state,
            map,
            props,
            store,
            mapControl
        }
    }
}
</script>
<template>
    <div id="map" class="map"></div>
    <asideTool class="asideTool position-absolute top-50 translate-middle-y" id="asideTool"
    @onMapControl="({ action, value }) => { mapControl({ action, value }) }" />
    <div class="conditionCom d-none d-sm-block position-absolute">
            <div class="mb-4">
                <button class="border-0 w-100 rounded-4 text-white text-center p-2 fw-bold fs-5"
                    style="background: blue;"
                    v-if="!state.conditionWrap" @click="state.conditionWrap = true">
                    圖層選項
                </button>
                <div class="mb-4"
                v-if="state.conditionWrap"
                @onLayerControl="({ action, value }) => { layerControl({ action, value }) }">
                    <Condition
                    v-bind="{
                        tribeQuery: state.tribeQuery,
                        mapLayers: state.mapLayers,
                        currentLayers: state.currentLayers,
                        onClose: () => {
                            state.conditionWrap = false
                        },
                        showSelectLayerValue: (val) => {
                            state.selectValueTemp = val
                        },
                        moveToMap: (val) => {
                            moveToMap(val)
                        }
                    }"
                    @onLayerControl="({ action, value }) => { layerControl({ action, value }) }"
                    />
                </div>
                <OverLayer :text="'可選擇要加入的圖層'" :styles="'right: 105%;top: 0;text-align: right;'" />
            </div>

            <div>
                <button class="border-0 w-100 rounded-4 text-white text-center p-2 fw-bold fs-5"
                    style="background: blue;"
                    v-if="!state.layerSelect" @click="state.layerSelect = true">
                    已選擇的圖層
                </button>
                <div
                v-if="state.layerSelect">
                    <LayerSelector
                    v-bind="{
                        selectLock: state.selectLock,
                        currentLayers: state.currentLayers,
                        onClose: () => {
                            state.layerSelect = false
                        },
                        onLockLayer: () => {
                            state.selectLock = !state.selectLock
                        },
                        onDeleteLayer: ({ action, value }) => {
                            if (value.layerName == 'all') {
                                state.deleteLightbox = true
                            } else {
                                layerControl({ action, value })
                            }
                        },
                        onDeleteLayerAll: () => {
                            state.deleteLightbox = true
                        },
                        onLayerControl: ({ action, value }) => {
                            layerControl({ action, value })
                        },
                    }" />
                </div>
                <OverLayer :text="'顯示已經選擇的圖層'" :styles="'right: 105%;top: 0;text-align: right;'" />
            </div>
        </div>

        <div class="stepOverLayer position-absolute top-0 start-0 w-100 h-100 bg-black opacity-50" id="firstEnter"
        v-if="store.state.isInit"
        @click="()=>{
            store.dispatch('updateLayerStatus', false)
        }"></div>
</template>

<style lang="sass">
.map
    width: 100vw
    height: 100vh
.asideTool
    z-index: 220
    left: 20px
.conditionCom
    width: 480px
    right: 1%
    bottom: 5%
</style>
