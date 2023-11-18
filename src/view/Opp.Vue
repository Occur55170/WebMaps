<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol'
import Select from 'ol/interaction/Select';
import { ScaleLine } from 'ol/control.js';

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

import { altKeyOnly, click, pointerMove } from 'ol/events/condition.js';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import {getTopLeft, getWidth} from 'ol/extent.js';
import {DEVICE_PIXEL_RATIO} from 'ol/has.js';

import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import {transformExtent} from 'ol/proj.js';

const projection = getProjection('EPSG:3857');

export default {
    props: {
    },
    setup(props, { emit }) {
        let map
        onMounted(async () => {
            const osm = new TileLayer({
                preload: Infinity,
                source: new OSM(),
            });

            map = new Map({
                layers: [
                    osm,
                ],
                target: 'map',
                view: new View({
                    projection: 'EPSG:4326',
                    center: [120.971859, 24.801583],
                    zoom: 14,
                }),
            });
        })

        function addLayer() {
            const aLayer =  new ImageLayer({
                extent: [-13884991, 2870341, -7455066, 6338219],
                source: new ImageWMS({
                url: 'https://ahocevar.com/geoserver/wms',
                params: {'LAYERS': 'topp:states'},
                ratio: 1,
                serverType: 'geoserver',
                }),
            })
            map.addLayer(aLayer)
        }
        function bddLayer() {
            const matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            const resolutions = [156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.748113140705, 152.8740565703525, 76.43702828517625, 38.21851414258813, 19.109257071294063, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.29858214173896974, 0.14929107086948487]

            const bLayer = new TileLayer({
                preload: Infinity,
                source: new WMTS({
                    // png
                    // url: "https://wmts.nlsc.gov.tw/wmts/PARK/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}",
                    // gif
                    url: "https://landmaps.nlsc.gov.tw/S_Maps/wmts/DMAPS/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}",
                    matrixSet: 'GoogleMapsCompatible',
                    requestEncoding: 'REST',
                    format: 'image/gif',
                    transparente: true,
                    projection,
                    tileGrid: new WMTSTileGrid({
                        origin: [-20037508, 20037508],
                        resolutions: resolutions,
                        matrixIds: matrixIds,
                    }),
                    tileLoadFunction: function (tile, src) {
                        console.log(2,tile, src)
                        const gifUrl = src;
                        const gif = gifler(gifUrl);
                        gif.frames(
                            document.createElement('canvas'),
                            function (ctx, frame) {
                                if (!iconFeature.getStyle()) {
                                iconFeature.setStyle(
                                    new Style({
                                    image: new Icon({
                                        img: ctx.canvas,
                                        opacity: 0.8,
                                    }),
                                    })
                                );
                                }
                                ctx.clearRect(0, 0, frame.width, frame.height);
                                ctx.drawImage(frame.buffer, frame.x, frame.y);
                                map.render();
                            },
                            true
                        );
                        tile.getImage().src = src;
                    },
                    style: 'normal',
                }),
            });



            map.addLayer(bLayer)
        }

        function showMap() {
            console.log(map.getLayers())
        }

        return {
            map,
            showMap,
            addLayer,
            bddLayer
        }
    }
}
</script>

<template>
    <div>
        <button @click="addLayer()">add</button>
        <button @click="bddLayer()">bdd</button>
        <button @click="showMap()">123</button>
        <div id="map" class="map"></div>
    </div>
</template>

<style lang="sass" scoped>
#map
    width: 100%
    height: 1000px
</style>

