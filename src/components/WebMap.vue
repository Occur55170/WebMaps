<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊

import { TileArcGISRest } from 'ol/source.js'

import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import Point from 'ol/geom/Point'
import VectorSource from 'ol/source/Vector.js'
import { Fill, Stroke, Style } from 'ol/style.js';
import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import { Image as ImageLayer } from 'ol/layer.js'
import ImageWMS from 'ol/source/ImageWMS'
import { FullScreen, defaults as defaultControls } from 'ol/control.js'
import { defaults as defaultInteractions, DragRotateAndZoom } from 'ol/interaction'
import PerspectiveMap from "ol-ext/map/PerspectiveMap"

import EsriJSON from 'ol/format/EsriJSON.js'
import { createXYZ } from 'ol/tilegrid.js'
// import { fromLonLat } from 'ol/proj.js'
import { tile as tileStrategy } from 'ol/loadingstrategy.js'

import 'ol/ol.css' // ol提供的css样式

export default {
    props: {},
    setup(props, { emit }) {
        const state = reactive({
            defaultCenter: [120.971859, 24.801583], //lng, lat
            defaultCenterZoom: 17,
            targetNum: 1,
            conditionWrap: false,
            currentLayerNames: [],

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
            rotation: 10
        });

        // 初始化地圖
        function initMap() {
            const map1 = document.createElement('div')
            map1.setAttribute('id', 'map1')
            map1.setAttribute('class', 'map1 w-100')
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

        function mapControl({action, value}) {
            console.log({action, value})
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
                case 'moveTo':
                    if (value) {
                        const { xAxis, yAxis } = value
                        View.animate({
                            center: [xAxis, yAxis],
                            // center: [ 1.748904, 52.469845],
                            zoom: 10,
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

        function layerControl({action, value}) {
            let target = state.targetNum == 1 ? map1 : map2
            let targetView = target.value.getView()
            let targetLayers = target.value.getLayers()
            switch (action) {
                case 'mapMode':
                    console.log({action, value})
                    let layersName = value.layersName
                    if (value.checked) {
                        // 預設寫好設定檔案
                        let newLayer
                        switch (value.layerName) {
                            case 'america':
                                newLayer = new TileLayer({
                                    // name 要針對每個圖層寫死
                                    name: 'america',
                                    className: 'america',
                                    preload: Infinity,
                                    source: new TileArcGISRest({
                                        url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/' + 'USA/MapServer',
                                    }),
                                })
                                targetLayers.extend([newLayer])
                                break;
                            case 'EsriJSON':
                                EsriJSON()
                                break;
                        }
                        // targetLayers.addLayer([newLayer])
                    } else {
                        // 刪除圖層事件 需要重寫
                        let layersAry = targetLayers.getArray();
                        layersAry.forEach(element => {
                            if(element.get('name') === value.layerName){
                                target.value.removeLayer(element);
                            }
                        });
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
                            name: 'OSM',
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
            getCurrentLayerNames()
        }

        function addMapCount() {
            const map2 = document.createElement('div')
            map2.setAttribute('id', 'map2')
            map2.setAttribute('class', 'map2 w-100')
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

        function EsriJSON() {
            const serviceUrl = 'https://services8.arcgis.com/jz4Cju60Wi6R7jAW/arcgis/rest/services/' + 'RIVERPOLY_(1)/FeatureServer/0'
            const style = new Style({
                fill: new Fill(),
                stroke: new Stroke({
                    color: [0, 0, 0, 1],
                    width: 0.5,
                }),
            });

            const vectorSource = new VectorSource({
                format: new EsriJSON(),
                url: function (extent, resolution, projection) {
                    const srid = projection.getCode().split(/:(?=\d+$)/).pop();
                    const url = serviceUrl + '/query/?f=json&' + 'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent(`{"xmin":${ extent[0] },"ymin":${ extent[1] },"xmax":${ extent[2] },"ymax":${ extent[3] },"spatialReference":{"wkid":${ srid }}}`) +
                    '&geometryType=esriGeometryEnvelope&inSR=' + srid + '&outFields=*' + '&outSR=' + srid;
                    return url;
                },
                strategy: tileStrategy(
                    createXYZ({
                        tileSize: 512,
                    })
                ),
            });

            const newVector = new VectorLayer({
                source: vectorSource,
                style: function (feature) {
                    const classify = feature.get('LU_2014');
                    const color = [0, 0, 0, 0];
                    style.getFill().setColor(color);
                    return style;
                },
                opacity: 0.7,
            });
            // let target = state.targetNum == 1 ? map1 : map2
            map1.value.addLayer(newVector)
        }

        function getCurrentLayerNames() {
            let target = state.targetNum == 1 ? map1 : map2
            const layers = target.value.getLayers().getArray();
            state.currentLayerNames = layers.map(layer => layer.get('name'));
        }

        function changeTarget(value){
            state.targetNum = value
            getCurrentLayerNames()
        }

        function conditionWrap(){
            state.conditionWrap = !state.conditionWrap
        }

        function showLayers() {
            let target = state.targetNum == 1 ? map1 : map2
            console.log(target.value.getLayers().getArray())
        }
        onMounted(() => {
            initMap()
        })

        return {
            state,
            props,
            mapControl,
            layerControl,
            getCurrentLayerNames,
            changeTarget,
            conditionWrap,
            showLayers,
            EsriJSON
        }
    }
}
</script>

<template>
    <div ref="mapCom">
        <div class="SearchBar position-absolute top-0 start-0">
            <SearchBar
            :currentLayerNames="state.currentLayerNames"
            @onLayerControl="({action, value})=>{layerControl({action, value})}"
            @onChangeTarget="(value)=>{changeTarget(value)}"
            @openConditionWrap="conditionWrap"
            />
        <Button @click="showLayers">show</Button>
        <Button @click="EsriJSON">add</Button>
        </div>
        <div class="asideTool position-absolute top-50 translate-middle-y" id="asideTool">
            <asideTool @onMapControl="({action, value})=>{mapControl({action, value})}"  />
        </div>
        <div class="w-100 d-flex flex-nowrap mapWrap" id="mapWrap"></div>
        <div class="condition bg-white position-absolute end-0 bottom-0 mt-2" v-if="state.conditionWrap">
            <condition
            :currentLayerNames="state.currentLayerNames"
            @onMapControl="({action, value})=>{mapControl({action, value})}"
            @onLayerControl="({action, value})=>{layerControl({action, value})}"
            />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.mapWrap
    justify-content: space-between
    height: 100vh

.mapWrap div
    width: 100%
</style>
