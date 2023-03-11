import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
import Overlay from 'ol/Overlay'// 引入覆蓋物模塊

import { TileArcGISRest } from 'ol/source.js'

import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import VectorSource from 'ol/source/Vector.js'
import { Fill, Stroke, Style } from 'ol/style.js'
import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import OSM from 'ol/source/OSM'
import PerspectiveMap from "ol-ext/map/PerspectiveMap"

import EsriJSON from 'ol/format/EsriJSON.js'
import { createXYZ } from 'ol/tilegrid.js'
import { tile as tileStrategy } from 'ol/loadingstrategy.js'

import 'ol/ol.css' // ol提供的css样式

export default {
    america: () => {
        return new TileLayer({
            name: 'america',
            className: 'america',
            preload: Infinity,
            source: new TileArcGISRest({
                url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/' + 'USA/MapServer',
            }),
        })
    },
    EsriJSON: () => {
        const serviceUrl = 'https://services8.arcgis.com/jz4Cju60Wi6R7jAW/arcgis/rest/services/' + 'RIVERPOLY_(1)/FeatureServer/0'
        const style = new Style({
            fill: new Fill(),
            stroke: new Stroke({
                color: [0, 38, 115, 1],
                width: 0.5,
            }),
        });

        const newVectorSource = new VectorSource({
            format: new EsriJSON(),
            url: function (extent, resolution, projection) {
                const srid = projection.getCode().split(/:(?=\d+$)/).pop();
                const url = serviceUrl + '/query/?f=json&' + 'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent(`{"xmin":${extent[0]},"ymin":${extent[1]},"xmax":${extent[2]},"ymax":${extent[3]},"spatialReference":{"wkid":${srid}}}`) +
                    '&geometryType=esriGeometryEnvelope&inSR=' + srid + '&outFields=*' + '&outSR=' + srid;
                return url;
            },
            strategy: tileStrategy(
                createXYZ({
                    tileSize: 512,
                })
            ),
        });

        return new VectorLayer({
            name: 'EsriJSON',
            source: newVectorSource,
            style: function (feature) {
                const color = [0, 38, 115, 1];
                style.getFill().setColor(color);
                return style;
            },
            opacity: 0.7,
        });
    },
    BsriJSON: () => {
        const serviceUrl = 'https://services8.arcgis.com/jz4Cju60Wi6R7jAW/arcgis/rest/services/' + '河川支流/FeatureServer/0'
        const style = new Style({
            fill: new Fill(),
            stroke: new Stroke({
                color: [0, 0, 0, 1],
                width: 0.5,
            }),
        });

        const newVectorSource = new VectorSource({
            format: new EsriJSON(),
            url: function (extent, resolution, projection) {
                const srid = projection.getCode().split(/:(?=\d+$)/).pop();
                const url = serviceUrl + '/query/?f=json&' + 'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent(`{"xmin":${extent[0]},"ymin":${extent[1]},"xmax":${extent[2]},"ymax":${extent[3]},"spatialReference":{"wkid":${srid}}}`) +
                    '&geometryType=esriGeometryEnvelope&inSR=' + srid + '&outFields=*' + '&outSR=' + srid;
                return url;
            },
            strategy: tileStrategy(
                createXYZ({
                    tileSize: 512,
                })
            ),
        });

        return new VectorLayer({
            name: 'BsriJSON',
            source: newVectorSource,
            style: function (feature) {
                const color = [0, 0, 0, 1];
                style.getFill().setColor(color);
                return style;
            },
            opacity: 1,
        });
    },
    roads: () => {
        const key = 'Gu2rcfenfMEKjKXgPF6H'
        return new TileLayer({
            name: 'roads',
            source: new XYZ({
                url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
                tileSize: 512,
                maxZoom: 22,
            }),
        })
    },
    imagery: () => {
        const key = 'Gu2rcfenfMEKjKXgPF6H'
        return new TileLayer({
            name: 'imagery',
            source: new XYZ({
                url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
                maxZoom: 20,
            }),
        })
    },
    // DimensionMap: (obj)=>{
    //     return new PerspectiveMap({
    //         layers: [baseMapList.sourceFun('default')],
    //         target: state.targetNum == 1 ? 'map1' : 'map2',
    //         view: defaultView,
    //         controls: [],
    //     })
    // }
}


// [230, 0, 0, 1] 紅色
// [104, 104, 104, 1] 灰色
// [115, 76, 0, 1] 土黃色