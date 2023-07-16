<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View } from 'ol'
import 'ol/ol.css'
import { OSM } from 'ol/source.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import baseMapList, { getBaseMapAll } from '@/config/baseMapList'
import { toPng } from "html-to-image"
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS';
import ImageStatic from 'ol/source/ImageStatic'

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js'
proj4.defs(
    'EPSG:3826',
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
proj4.defs("ESRI:54032", "+proj=aeqd +lat_0=52.346900 +lon_0=19.092600 +x_0=800 +y_0=800 +ellps=sphere +datum=WGS84 +units=m +no_defs");

register(proj4)
export default {
    props: {
    },
    setup(props, { emit }) {
        const state = reactive({
            layerDataList: []
        })
        let map
        onMounted(async () => {
            console.log(1)
            map = new Map({
                target: 'imgMap',
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: [120.971859, 24.801583], // 地圖中心點
                    zoom: 10, // 初始縮放級別
                    projection: 'EPSG:4326'
                })
            })
        })


        function getLayerData() {
            return $.ajax({
                url: 'https://api.edtest.site/layers',
                method: "GET"
            }).done(res => {
                state.layerDataList = res
            })
        }

        // 加入即時雷達圖層
        function adLayer() {
            let vectorLayer = new Image({
                source: new ImageStatic({
                    url: state.layerDataList[14].tiles_url,
                    imageExtent: state.layerDataList[14]?.image_options?.image_extent,
                    projection: 'EPSG:3857', // 圖片投影，根據需求更改
                    imageLoadFunction: function (image, src) {
                        var img = new Image();
                        img.onload = function () {
                            // 將圖片資料複製到畫布上
                            var canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            var context = canvas.getContext('2d');
                            context.drawImage(img, 0, 0);
                            image.getImage().src = canvas.toDataURL('image/png');
                        };
                        img.src = src;
                    }
                })
            })

            map.addLayer(vectorLayer)
        }

        function showCurrentLayer() {
            console.log(map.getLayers().getArray())
        }
        onMounted(async () => {
            await getLayerData()
        })

        return {
            state,
            map,
            adLayer,
            showCurrentLayer
        }
    }
}
</script>

<template>
    <div>
        <div id="imgMap"></div>
        <button @click="adLayer()">adLayer</button>
        <button @click="showCurrentLayer()">showCurrentLayer</button>
    </div>
</template>

<style lang="sass" scoped>
#imgMap
    width: 100vw
    height: 1000px
</style>

