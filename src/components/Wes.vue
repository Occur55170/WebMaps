<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'
import { Map, View } from 'ol'
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
            defaultCenter: [120.971859, 24.801583], //lng, lat
        })

        let map;

        function initMap() {


            const layer = '0';

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

            const raster = new TileLayer({
                source: new XYZ({
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                }),
            });

            map = new Map({
                layers: [raster, vector],
                target: document.getElementById('map'),
                view: new View({
                    center: fromLonLat([1.72, 52.4]),
                    zoom: 14,
                }),
            });

        }
        function showLayers() {
            console.log(map.getLayers().getArray())
        }
        function removeLayers() {
            map.getLayers().getArray().splice(1, 1)
        }
        function move() {
            // let target = props.targetNum == 1 ? map1 : map2
            // let targetView = target.value.getView()
            // let targetLayers = target.value.getLayers()
            map.getView().animate({
                center: fromLonLat(state.defaultCenter),
                // center: [120.975402, 24.785897],
                zoom: 10,
                duration: 100,
            });
        }

        onMounted(() => {
            initMap()
        })
        return {
            state,
            showLayers,
            removeLayers,
            move
        }
    }
}
</script>

<template>
    <BUtton @click="showLayers">123</BUtton>
    <BUtton @click="removeLayers">remove</BUtton>
    <BUtton @click="move">move</BUtton>
    <div tabindex="2" id="map" class="map__x"></div>
</template>
<style lang="scss" scoped>
.map__x {
    width: 100%;
    height: 600vh;
    border: 1px solid #eee;
}
</style>