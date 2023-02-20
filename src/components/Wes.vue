<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'
import { Map, View } from 'ol'
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import 'ol/ol.css'

import EsriJSON from 'ol/format/EsriJSON.js';
import VectorSource from 'ol/source/Vector.js';
import XYZ from 'ol/source/XYZ.js';
import { Fill, Stroke, Style } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { createXYZ } from 'ol/tilegrid.js';
import { fromLonLat } from 'ol/proj.js';
import { tile as tileStrategy } from 'ol/loadingstrategy.js';
import GeoJSON from 'ol/format/GeoJSON';



const map = ref(null) // 绑定地图实例的变量

export default {
    setup(props, { emit }) {
        const state = reactive({
            defaultCenter: [120.971580, 24.804015], //lng, lat
        })

        let map;
        function initMap() {
            const raster = new TileLayer({
                preload: Infinity,
                name: 'defaultLayer',
                source: new OSM()
            })

            const compass = ref(null) // 覆蓋物實例
            compass.value = new Overlay({
                element: compass.value,
                positioning: 'center-center',
                stopEvent: false
            });

            map = new Map({
                layers: [raster],
                target: document.getElementById('map'),
                overlays: [
                    compass.value,
                ],
                view: new View({
                    center: fromLonLat(state.defaultCenter),
                    zoom: 15,
                    duration: 100,
                }),
            });

        }
        function testData(){
            // 获取当前激活的图层
            const currentLayer = map.getLayers().getArray().find(layer => layer.getVisible());

            // 获取当前激活的图层的名称
            const currentLayerName = currentLayer.get('name');

            // 获取当前激活的图层的数据源
            const currentSource = currentLayer.getSource();

            // 获取当前激活的图层的要素数量
            const featureCount = currentSource.getFeatures().length;
        }
        function showLayers() {
            console.log(map.getLayers().getArray())
        }
        function addLayers() {
            console.log('1')
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

            const vector = new VectorLayer({
                source: vectorSource,
                style: function (feature) {
                    const classify = feature.get('LU_2014');
                    const color = [0, 0, 0, 0];
                    style.getFill().setColor(color);
                    return style;
                },
                opacity: 0.7,
            });
            map.addLayer(vector)
        }
        function removeLayers() {
            map.getLayers().getArray().splice(1, 1)
        }

        onMounted(() => {
            initMap()
        })
        return {
            state,
            showLayers,
            addLayers,
            removeLayers,
        }
    }
}
</script>

<template>
    <Button @click="showLayers">show</Button>
    <Button @click="addLayers">add</Button>
    <Button @click="removeLayers">remove</Button>
    <div tabindex="2" id="map" class="map__x"></div>
    <!-- 彈跳視窗容器 -->
    <div class="popup" ref="popupCom">
        <!-- 關閉按钮 -->
        <span class="icon-close" @click="closePopup">✖</span>
        <!-- 彈跳視窗内容（展示座標信息） -->
        <div class="content">{{ currentCoordinate }}</div>
    </div>
</template>
<style lang="sass" scoped>
.map__x
    width: 100%
    height: 600vh
    border: 1px solid #eee

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