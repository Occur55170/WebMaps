<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
// olPerspectiveMap
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊

import { TileArcGISRest } from 'ol/source.js';

import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Style } from 'ol/style.js'
import { Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import { Image as ImageLayer } from 'ol/layer.js';
import ImageWMS from 'ol/source/ImageWMS'
import { FullScreen, defaults as defaultControls } from 'ol/control.js';
import { defaults as defaultInteractions, DragRotateAndZoom } from 'ol/interaction';

import 'ol/ol.css' // ol提供的css样式


export default {
    props: {
        targetNum: {
            type: Number,
            default: 1
        }
    },
    setup(props, { emit }) {
        const state = reactive({
            defaultCenter: [120.971859, 24.801583], //lng, lat
            defaultCenterZoom: 17,
        })
        const compassBox = ref(null)

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

        compassBox.value = new Overlay({
            element: compassBox.value,
            positioning: 'center-center',
            stopEvent: false,
            rotation: 0
        })

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
                overlays: [
                    compassBox.value,
                ],
                controls: [],
            })
        }

        // 地圖旋轉事件
        function mapRotate() {
            defaultView.on('change:rotation', evt => {
                const rotation = map1.value.getView().getRotation();
                const rotationDegrees = Math.floor(rotation * 180 / Math.PI);
                console.log(`地圖旋轉角度為 ${rotationDegrees}`);

                //  轉動遮照
                const newMask = document.getElementById('compass');
                newMask.style.transform = `rotate(${rotationDegrees}rad)`;
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
            map1.value.addLayer(marker);
        }

        function controlMap(action) {
            // let target = props.targetNum == 1 ? map1 : map2
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
            switch (action) {
                case 'moveTo':
                    if (value) {
                        const { xAxis, yAxis } = value
                        targetView.animate({
                            center: [xAxis, yAxis],
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
                    if (value) {
                        const url =
                            'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/' +
                            'USA/MapServer';
                        let newLayer = new TileLayer({
                            preload: Infinity,
                            source: new TileArcGISRest({
                                url: url,
                            }),
                        });
                        map1.value.getLayers().extend([newLayer]);
                    }
                    // 尚未關閉layout
                    break;
                case 'layouts':
                    if (value === 2 && !document.getElementById('map2')) {
                        addMapCount()
                    }
                    if (value === 1 && document.getElementById('map2')) {
                        document.getElementById('map2').remove()
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

        onMounted(() => {
            initMap()
            nextTick(() => {
                const rotation = map1.value.getView().getRotation();
                const rotationDegrees = Math.floor(rotation * 180 / Math.PI);
                console.log(`地圖旋轉角度為 ${rotationDegrees}`);

                // bug
                const newMask = document.getElementById('compass');
                newMask.style.transform = `rotate(${rotationDegrees}rad)`;
                mapRotate()
            })
        })

        return {
            state,
            props,
            controlMap,
            layerControl
        }
    }
}
</script>

<template>
    <div ref="mapCom">
        <div class="w-100 d-flex flex-nowrap mapWrap yys" id="mapWrap"></div>
        <div ref="compassBox" class="compass" id="compass" @click="controlMap('toNorth')">
            <img src="https://cdn.pixabay.com/photo/2012/04/02/15/57/right-24825_1280.png" alt="Compass">
        </div>
    </div>
</template>

<style lang="sass" scoped>
.mapWrap
    justify-content: space-between
    height: 100vh

.mapWrap div
    width: 100%

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
</style>
