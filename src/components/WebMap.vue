<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
// olPerspectiveMap
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊

import { TileArcGISRest } from 'ol/source.js'

import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Style } from 'ol/style.js'
import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import { Image as ImageLayer } from 'ol/layer.js'
import ImageWMS from 'ol/source/ImageWMS'
import { FullScreen, defaults as defaultControls } from 'ol/control.js'
import { defaults as defaultInteractions, DragRotateAndZoom } from 'ol/interaction'
import PerspectiveMap from "ol-ext/map/PerspectiveMap"

import 'ol/ol.css' // ol提供的css样式


export default {
    props: {
        targetNum: {
            type: Number,
            default: 1
        },
        layerList: {
            type: Array,
            default: []
        }
    },
    setup(props, { emit }) {
        const state = reactive({
            defaultCenter: [120.971859, 24.801583], //lng, lat
            defaultCenterZoom: 17,
            // targetMap: props.targetNum == 1 ? map1 : map2
        })

        const defaultLayers = [
            new TileLayer({
                preload: Infinity,
                name: 'defaultLayer',
                source: new OSM()
            }),
        ];

        const defaultView = new View({
            projection: 'EPSG:4326',
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
            // 測試用
            rotation: 1
        });


        // 初始化地圖
        function initMap() {
            const map1 = document.createElement('div')
            map1.setAttribute('id', 'map1')
            map1.setAttribute('class', 'w-100')
            document.getElementById('mapWrap').appendChild(map1)
            map1.value = new Map({
                target: 'map1',
                layers: defaultLayers,
                view: defaultView,
                controls: [],
            })
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
            map1.value.addLayer(marker);
        }

        function mapControl(action) {
            let View = map1.value.getView()
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
                case 'fullScreen':
                    let target = map1
                    if (target.requestFullscreen) {
                        target.requestFullscreen()
                    } else if (target.msRequestFullscreen) {
                        target.msRequestFullscreen()
                    } else if (target.mozRequestFullScreen) {
                        target.mozRequestFullScreen()
                    } else if (target.webkitRequestFullscreen) {
                        target.webkitRequestFullscreen()
                    }
                    break;
            }
        }

        function layerControl(action, value) {
            let target = props.targetNum == 1 ? map1 : map2
            let targetView = target.value.getView()
            let targetLayers = target.value.getLayers()
            switch (action) {
                case 'moveTo':
                    if (value) {
                        const { xAxis, yAxis } = value
                        targetView.animate({
                            center: [xAxis, yAxis],
                            // center: [ 1.748904, 52.469845],
                            zoom: 10,
                            duration: 100,
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(function (pos) {
                            targetView.animate({
                                center: [pos.coords.longitude, pos.coords.latitude],
                                zoom: 17,
                                duration: 100,
                            });
                            addPoint(pos.coords.longitude, pos.coords.latitude)
                        })
                    }
                    break;
                case 'mapMode':
                    let layersName = value.layersName
                    if (value.checked) {
                        // 預設寫好設定檔案
                        let newLayer = new TileLayer({
                            // name 要針對每個圖層寫死
                            name: 'america',
                            className: 'america',
                            preload: Infinity,
                            source: new TileArcGISRest({
                                url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/' + 'USA/MapServer',
                            }),
                        })
                        targetLayers.extend([newLayer])
                    } else {
                        var layers = targetLayers.getArray();
                        layers.forEach(node => {
                            if(node.get('name') == layersName){
                                target.value.removeLayer(node);
                            }
                        })
                    }
                    break;
                case 'changeMapCount':
                    if (value === 2 && !document.getElementById('map2')) {
                        addMapCount()
                    }
                    if (value === 1 && document.getElementById('map2')) {
                        document.getElementById('map2').remove()
                    }
                    break;
                case 'changeDimensionMap':
                    target.innerHTML = ''
                    if(value === '3D'){
                        const layer = new Tile({
                            name: "OSM",
                            preload: Infinity,
                            source: new OSM()
                        })
                        target.value = new PerspectiveMap({
                            target: target,
                            layers: [layer],
                            view: targetView,
                            controls: [],
                        })
                    } else {
                        const layer = new TileLayer({
                            preload: Infinity,
                            name: 'defaultLayer',
                            source: new OSM()
                        })
                        target.value = new Map({
                            target: target,
                            layers: [layer],
                            view: targetView,
                            controls: [],
                        })
                    }
                    break;
            }
        }

        function addMapCount() {
            const map2 = document.createElement('div')
            map2.setAttribute('id', 'map2')
            map2.setAttribute('class', 'w-100')
            document.getElementById('mapWrap').appendChild(map2)

            const center2 = Object.values(map1.value.getView().getCenter())
            const zoom2 = map1.value.getView().getZoom()
            const proj2 = map1.value.getView().getProjection()
            map2.value = new Map({
                target: 'map2',
                layers: [
                    new TileLayer({
                        preload: Infinity,
                        name: 'defaultLayer',
                        source: new OSM()
                    })
                ],
                view: defaultView,
                controls: [],
            })
        }

        function addLayers() {
            // test
            const layer = new TileLayer({
                preload: Infinity,
                name: 'defaultLayer',
                source: new OSM()
            })
            map1.value.getLayers().extend([layer]);
        }
        function showLayers() {
            console.log(map1.value.getLayers().getArray())
        }

        onMounted(() => {
            initMap()
        })

        return {
            state,
            props,
            mapControl,
            layerControl,
            showLayers
        }
    }
}
</script>

<template>
    <div ref="mapCom">
        <div class="w-100 d-flex flex-nowrap mapWrap" id="mapWrap"></div>
    </div>
</template>

<style lang="sass" scoped>
.mapWrap
    justify-content: space-between
    height: 100vh

.mapWrap div
    width: 100%
</style>
