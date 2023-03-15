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
    example: () => {
        const serviceUrl =
            'https://services-eu1.arcgis.com/NPIbx47lsIiu2pqz/ArcGIS/rest/services/' +
            'Neptune_Coastline_Campaign_Open_Data_Land_Use_2014/FeatureServer/';
        const layer = '0';
        const fillColors = {
            'Lost To Sea Since 1965': [0, 0, 0, 1],
            'Urban/Built-up': [104, 104, 104, 1],
            'Shacks': [115, 76, 0, 1],
            'Industry': [230, 0, 0, 1],
            'Wasteland': [230, 0, 0, 1],
            'Caravans': [0, 112, 255, 0.5],
            'Defence': [230, 152, 0, 0.5],
            'Transport': [230, 152, 0, 1],
            'Open Countryside': [255, 255, 115, 1],
            'Woodland': [38, 115, 0, 1],
            'Managed Recreation/Sport': [85, 255, 0, 1],
            'Amenity Water': [0, 112, 255, 1],
            'Inland Water': [0, 38, 115, 1],
        }

        const style = new Style({
            fill: new Fill(),
            stroke: new Stroke({
                color: [0, 0, 0, 1],
                width: 0.5,
            }),
        })

        const vectorSource = new VectorSource({
            format: new EsriJSON(),
            url: function (extent, resolution, projection) {
                // ArcGIS Server only wants the numeric portion of the projection ID.
                const srid = projection
                    .getCode()
                    .split(/:(?=\d+$)/)
                    .pop();

                const url =
                    serviceUrl +
                    layer +
                    '/query/?f=json&' +
                    'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent(
                        '{"xmin":' +
                        extent[0] +
                        ',"ymin":' +
                        extent[1] +
                        ',"xmax":' +
                        extent[2] +
                        ',"ymax":' +
                        extent[3] +
                        ',"spatialReference":{"wkid":' +
                        srid +
                        '}}'
                    ) +
                    '&geometryType=esriGeometryEnvelope&inSR=' +
                    srid +
                    '&outFields=*' +
                    '&outSR=' +
                    srid;

                return url;
            },
            strategy: tileStrategy(
                createXYZ({
                    tileSize: 512,
                })
            ),
            attributions:
                'University of Leicester (commissioned by the ' +
                '<a href="https://www.arcgis.com/home/item.html?id=' +
                'd5f05b1dc3dd4d76906c421bc1727805">National Trust</a>)',
        })

        const vector = new VectorLayer({
            name: 'vector',
            source: vectorSource,
            style: function (feature) {
                const classify = feature.get('LU_2014');
                const color = fillColors[classify] || [0, 0, 0, 0];
                style.getFill().setColor(color);
                return style;
            },
            opacity: 0.7,
        });

        const raster = new TileLayer({
            name: 'raster',
            source: new XYZ({
                url:
                    'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                    'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            }),
        })
        return [raster, vector]
    },
    example2: () => {

        const circleFeature = new Feature({
            geometry: new Circle([12127398.797692968, 4063894.123105166], 50),
        });
        circleFeature.setStyle(
            new Style({
                renderer(coordinates, state) {
                    const [[x, y], [x1, y1]] = coordinates;
                    const ctx = state.context;
                    const dx = x1 - x;
                    const dy = y1 - y;
                    const radius = Math.sqrt(dx * dx + dy * dy);

                    const innerRadius = 0;
                    const outerRadius = radius * 1.4;

                    const gradient = ctx.createRadialGradient(
                        x,
                        y,
                        innerRadius,
                        x,
                        y,
                        outerRadius
                    );
                    gradient.addColorStop(0, 'rgba(255,0,0,0)');
                    gradient.addColorStop(0.6, 'rgba(255,0,0,0.2)');
                    gradient.addColorStop(1, 'rgba(255,0,0,0.8)');
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
                    ctx.strokeStyle = 'rgba(255,0,0,1)';
                    ctx.stroke();
                },
            })
        )
        const vector = new TileLayer({
            source: new OSM(),
            visible: true,
        })
        const raster = new VectorLayer({
            source: new VectorSource({
                features: [circleFeature],
            }),
        })
        return [vector, raster]

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