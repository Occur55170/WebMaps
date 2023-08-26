<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol'
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import {ScaleLine} from 'ol/control.js';

import { ImageArcGISRest, OSM } from 'ol/source.js'
import TileWMS from 'ol/source/TileWMS'
import { IGC, WFS, } from 'ol/format'
import * as ol from 'ol';
import { TileArcGISRest } from 'ol/source.js'

import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import ImageWMS from 'ol/source/ImageWMS.js';
import TileGrid from 'ol/layer/Tile.js';

import PerspectiveMap from "ol-ext/map/PerspectiveMap"

import EsriJSON from 'ol/format/EsriJSON.js'
import { createXYZ } from 'ol/tilegrid.js'
import { bbox, tile as tileStrategy } from 'ol/loadingstrategy.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import Projection from 'ol/proj/Projection.js'
import GeoJSON from 'ol/format/GeoJSON.js'

import OLCesium from 'olcs/OLCesium.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
import TileState from 'ol/TileState.js';

import 'ol/ol.css'

import mapLayerList from '@/config/mapLayerList'
import baseMapList, { getBaseMapAll } from '@/config/baseMapList'

import 'ol-ext/dist/ol-ext.css'
import * as olTilecoord from 'ol/tilecoord'
import { get as getProjection } from 'ol/proj'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo.js'
import Overlay from 'ol/Overlay.js'
import currentPositionImg from '@/assets/img/icon/currentPosition.svg';
proj4.defs(
  'Indiana-East',
  'PROJCS["IN83-EF",GEOGCS["LL83",DATUM["NAD83",' +
    'SPHEROID["GRS1980",6378137.000,298.25722210]],PRIMEM["Greenwich",0],' +
    'UNIT["Degree",0.017453292519943295]],PROJECTION["Transverse_Mercator"],' +
    'PARAMETER["false_easting",328083.333],' +
    'PARAMETER["false_northing",820208.333],' +
    'PARAMETER["scale_factor",0.999966666667],' +
    'PARAMETER["central_meridian",-85.66666666666670],' +
    'PARAMETER["latitude_of_origin",37.50000000000000],' +
    'UNIT["Foot_US",0.30480060960122]]'
);
register(proj4);

export default {
    props: {
    },
    setup(props, { emit }) {
        const state = reactive({
            layerDataList: []
        })
        let map
        onMounted(async () => {
            map = new Map({
                target: 'imgMap',
                layers: [
                    new TileLayer({
                        preload: Infinity,
                        crossOrigin: "Anonymous",
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    projection: 'Indiana-East',
                    center: fromLonLat([-85.685, 39.891], 'Indiana-East'),
                    // center: [120.971859, 24.801583],
                    zoom: 7,
                    extent: transformExtent(
                        [-172.54, 23.81, -47.74, 86.46],
                        'EPSG:4326',
                        'Indiana-East'
                    ),
                    // minZoom: 6,
                }),
            })
            map.addControl(new ScaleLine({
                units: 'metric', // 比例尺單位
                // className: 'aa',
                // target: 'bb',
            }));
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
        1
        <div id="imgMap"></div>
    </div>
</template>

<style lang="sass" scoped>
#imgMap
    width: 100%
    height: 1000px
</style>

