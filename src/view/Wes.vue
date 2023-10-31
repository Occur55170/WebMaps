<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'
import { Map, View, Feature } from 'ol'
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Style } from 'ol/style.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import { Point } from 'ol/geom.js'
import OLCesium from 'olcs/OLCesium.js';
import 'ol/ol.css'
import mapLayerList from '@/config/mapLayerList'
import baseMapList, { getBaseMapAll } from '@/config/baseMapList'
import 'ol-ext/dist/ol-ext.css'
import * as olTilecoord from 'ol/tilecoord'
import { get as getProjection } from 'ol/proj'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo.js'
import Overlay from 'ol/Overlay.js'
export default {
    props: {},
    setup(props, { emit }) {
        const mapLayers = mapLayerList
        const state = reactive({
            defaultCenter: [121.326776, 24.655499],
            defaultCenterZoom: 9,
            targetNum: 1,
            conditionWrap: false,
            layerSelect: false,
            currentLayers: [],
            layers: [],
            mapLayers: computed(() => {
                return state.layers.map((node, index) => {
                    return {
                        label: node.group_title,
                        value: node.value,
                        layers: node.group_layers,
                        groupClass: node.group_class
                    }
                })
            }),
            selectLock: false,
            mapCount: 1,
            map1: null,
            map2: null,
            map1LayerStatus: [],
            map2LayerStatus: [],
            temp: {
                map1BaseStatus: 0,
                map2BaseStatus: 0,
            },
            deleteLightbox: false,
            // 目前地圖狀態為2D or 3D
            dimensionMap: {
                map1: '2D',
                map2: '2D'
            },
            toSearchDimensionStatus: computed(() => {
                let target = state.targetNum == 1 ? 'map1' : 'map2'
                return state.dimensionMap[target] === '2D'
            }),
            ol3d: null,
            selectValueTemp: 0,
            areaData: {
                nodeRef: null,
                overlay: null,
                tribeAreaData: {},
            },
            comSize: {
                wrapHeight: '',
                wrapWidth: '',
                conditionCom: {},
            },
            selectLayerOption: {}
        })
        let ol3d = null
        const defaultView = new View({
            projection: 'EPSG:4326',
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
        })
        // 初始化地圖
        function initMap() {
            state.map1 = new Map({
                target: 'map1',
                layers: [
                    baseMapList.getBaseMapData(0)
                ],
                view: defaultView,
                controls: [],
            })
            const extent = [117.1595, 21.2646, 123.9804, 26.5353];
            const xCenter = (extent[2] + extent[0]) / 2;
            const yCenter = (extent[3] + extent[1]) / 2;
            const iconFeature = new Feature({
                geometry: new Point([xCenter, yCenter]),
            });
            const vectorLayer = new VectorLayer({
                source: new VectorSource({
                    features: [iconFeature]
                }),
            });
            state.map1.addLayer(vectorLayer)
            const gifUrl = 'http://localhost:5173/forecast.gif';
            const gif = gifler(gifUrl);
            const extentWidth = extent[2] - extent[0];
            const extentHeight = extent[3] - extent[1];
            gif.frames(
                document.createElement('canvas'),
                function (ctx, frame) {
                    const scaleX = extentWidth / frame.width;
                    const scaleY = extentHeight / frame.height;
                    const baseScale = Math.min(scaleX, scaleY);
                    // 獲取當前地圖的解析度
                    const currentResolution = state.map1.getView().getResolution();
                    iconFeature.setStyle(
                        new Style({
                            image: new Icon({
                                img: ctx.canvas,
                                imgSize: [frame.width, frame.height],
                                opacity: 0.8,
                                scale: baseScale / currentResolution
                            }),
                        })
                    );
                    ctx.clearRect(0, 0, frame.width, frame.height);
                    ctx.drawImage(frame.buffer, frame.x, frame.y);
                    // state.map1.render();
                },
                true
            );
        }
        function getCurrentMapData() {
            let target = state.targetNum == 1 ? state.map1 : state.map2
            const layers = target?.getLayers()?.getArray()
            state.currentLayers = layers?.map(layer => {
                return {
                    label: layer.get('label'),
                    id: layer.get('id'),
                    visible: layer.getVisible(),
                }
            })
        }
        function getBaseData() {
            return $.ajax({
                url: 'https://api.edtest.site/underLayers',
                method: 'GET'
            }).done(res => {
                return res
            })
        }
        function getLayerData() {
            return $.ajax({
                url: 'https://api.edtest.site/layers',
                method: "GET"
            }).done(res => {
                return (res)
            })
        }
        onMounted(async () => {
            let a = getBaseData()
            let b = getLayerData()
            Promise.all([a, b]).then((value) => {
                // TODO: pref
                let result = value[0].data.map((node, nodeIndex) => {
                    return {
                        mapType: 'base',
                        baseId: nodeIndex,
                        onCurrent: false,
                        ...node
                    }
                })
                baseMapList.setBaseMapData(result)
                state.temp.map1BaseStatus = 0
                state.temp.baseMapList = getBaseMapAll()
                state.layers = value[1].map((node, index) => {
                    node.group_layers.forEach((sub, subIndex) => {
                        let subNodeIndex = subIndex, nestedSubNodeIndex = undefined
                        sub.id = `node${index}_subNode${subNodeIndex}_nestedSubNode${nestedSubNodeIndex}`
                        if (!(sub.single_tiles)) {
                            sub.tiles_list.forEach((nestedSub, nestedSubIndex) => {
                                nestedSubNodeIndex = nestedSubIndex
                                nestedSub.id = `node${index}_subNode${subNodeIndex}_nestedSubNode${nestedSubNodeIndex}`
                            })
                        }
                    })
                    return {
                        ...node,
                        value: index,
                    }
                })
                nextTick(() => {
                    initMap()
                    getCurrentMapData()
                })
            })
            state.comSize.wrapHeight = window.innerHeight
            state.comSize.wrapWidth = window.innerWidth
            window.onresize = (e) => {
                state.comSize.wrapHeight = e.target.innerHeight
                state.comSize.wrapWidth = e.target.innerWidth
            }
        })
        return {
            state,
            props,
        }
    }
}
</script>
<template>
    <div>
        <div class="w-100 d-flex flex flex-sm-row flex-wrap flex-sm-nowrap mapWrap" id="mapWrap">
            <!-- TODO: 寬度設定是否調整 -->
            <div id="map1"
                :class="{ 'w-100': state.map1?.getTarget() == 'map1', 'h-100': state.mapCount === 1, 'h-50': state.mapCount === 2 && (state.comSize.wrapWidth < 600) }">
            </div>
        </div>
    </div>
</template>
<style lang="sass">
@import '@/assets/styles/all.module.scss'
.mapWrap
    justify-content: space-between
    height: 100vh
.mapWrap .ol-viewport
    height: 100vh
    width: 100vw
.asideTool
    z-index: 220
    left: 5px
.SearchBar
    top: 20px
    left: 20px
    z-index: 220
.conditionCom
    width: 480px
    right: 1%
    bottom: 5%
.middleLine
    width: 5px
    background: $blue-steel
.areaData
    width: 450px
    max-height: 550px
    background: #fff
    box-sizing: border-box
    border-radius: 10px
    border: 1px solid #088
@media (max-width: 600px)
    .m-Navbar
        z-index: 222
    .middleLine
        height: 1px
        width: 100%
</style>