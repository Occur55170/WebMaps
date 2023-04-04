import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊

import { TileArcGISRest } from 'ol/source.js'

import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import VectorSource from 'ol/source/Vector.js'
import { Fill, Stroke, Style, Icon } from 'ol/style.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import TileWMS from 'ol/source/TileWMS.js'
import ImageWMS from 'ol/source/ImageWMS.js'

import { ImageArcGISRest, OSM } from 'ol/source.js'
import PerspectiveMap from "ol-ext/map/PerspectiveMap"

import WFS from 'ol/format/WFS.js'
import EsriJSON from 'ol/format/EsriJSON.js'
import { createXYZ } from 'ol/tilegrid.js'
import { tile as tileStrategy } from 'ol/loadingstrategy.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import Projection from 'ol/proj/Projection.js'
import GeoJSON from 'ol/format/GeoJSON.js'

import 'ol/ol.css' // ol提供的css样式
import { format } from 'ol/coordinate'
import { get as getProjection, transformExtent } from 'ol/proj.js'
import { getTopLeft, getWidth } from 'ol/extent.js'

let obj
    ; (async () => {
        await $.ajax({
            url: 'https://api.edtest.site/layers',
            method: 'GET',
            dataType: '',
            success: (res) => {
                console.log('res')
                obj = res.map((node) => node)
            },
            error: (err) => {
                return err
            },
        });
    })();
export async function initLayers() {
    console.log('init GOGO')
    let obj
    $.ajax({
        url: 'https://api.edtest.site/layers',
        method: 'GET'
    }).done(res => {
        obj = res
    });
    return obj
}
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
            type: 'BsriJSON',
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
            type: 'roads',
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
            type: 'imagery',
            source: new XYZ({
                url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
                maxZoom: 20,
            }),
        })
    },
    DimensionMap: () => {
        const circleFeature = new Feature({
            name: 'DimensionMap',
            title: 'DimensionMap',
            geometry: new Circle([120.9984423386347, 24.791781619336316], 0.005),
        })

        const circleStyle = new Style({
            renderer(coordinates, state) {
                const [[x, y], [x1, y1]] = coordinates;
                const ctx = state.context;
                const dx = x1 - x;
                const dy = y1 - y;
                const radius = Math.sqrt(dx * dx + dy * dy);
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
                ctx.fillStyle = 'rgba(255,0,0)';
                ctx.fill();
            },
        })
        const raster = new VectorLayer({
            source: new VectorSource({
                features: [circleFeature],
            }),
            style: circleStyle
        })

        const coordinates = [
            [120.971859, 24.801583],
            [120.970000, 24.809583],
            [120.985000, 24.808583],
            [120.990000, 24.806583],
            [120.971859, 24.801583]
        ]


        const areaLineLayer = new Vector({
            name: 'DimensionMap',
            title: 'DimensionMap',
            source: new VectorSource({
                features: [new Feature({
                    name: 'areaLineLayer',
                    title: 'areaLineLayer',
                    geometry: new Polygon([coordinates]),
                })],
            }),
            style: new Style({
                fill: new Fill({
                    color: '#0f9ce2'
                }),
            })
        })


        // fix!!!整合成一個圖層
        return [raster, areaLineLayer]
        // 關閉地圖細節事件
    },
    getLayer: (layer) => {
        let result
        let layerType = layer.layer_type
        let figureType = layer.figure_type
        if (layerType === 'WMS') {
            switch (figureType) {
                case 'Point':
                    // 加入icon
                    // const iconFeature = new Feature(new Point([120.971859, 24.801583]));
                    // iconFeature.set('style',
                    //     new Style({
                    //         image: new Icon({
                    //             anchor: [0.5, 0.96],
                    //             crossOrigin: 'anonymous',
                    //             src: layer.icon,
                    //             width: 300,
                    //             height: 300,
                    //         }),
                    //     })
                    // )
                    // img: undefined,
                    // imgSize: img ? [img.width, img.height] : undefined,


                    // const PointFeature = new Feature(new Point([120.971859, 24.801583]));
                    // PointFeature.set('style',
                    //     new Style({
                    //         image: new Icon({
                    //             anchor: [0.5, 0.96],
                    //             crossOrigin: 'anonymous',
                    //             src: 'https://pixlr.com/img/icon/premium-tick.svg',
                    //             // layer.icon
                    //         }),
                    //     })
                    // );

                    // result = new VectorLayer({
                    //     style: function (feature) {
                    //         return feature.get('style');
                    //     },
                    //     source: new VectorSource({ features: [PointFeature] }),
                    // })

                    // testStyle
                    const iconStyle = new Point({
                        scale: 2, // 設置圖標放大為原來的兩倍
                        anchor: [0.5, 0.96],
                        crossOrigin: 'anonymous',
                        src: 'https://pixlr.com/img/icon/premium-tick.svg',
                        // src: layer.tiles_url,
                    })
                    const pointStyle = new Style({
                        image: iconStyle
                    })
                    // testStyle


                    const wmsSource = new TileWMS({
                        maxzoom: 18,
                        minzoom: 3,
                        url: 'https://dwgis1.ncdr.nat.gov.tw/server/services/MAP0627/Map2022FloodingPoint1721/MapServer/WMSServer',
                        params: {
                            'SERVICE': 'WMS',
                            'BGCOLOR': '0xFFFFFF',
                            'TRANSPARENT': 'TRUE',
                            'SRS': 'EPSG:3826',
                            'LAYERS': '0',
                            'VERSION': '1.1.1',
                            'FORMAT': 'image/png',
                        },
                        // serverType: 'mapserver',
                        crossOrigin: 'anonymous',
                    });
                    result = new TileLayer({
                        source: wmsSource,
                        style: pointStyle
                    })

                    // help_btn_display:true
                    // help_memo:"<p>資料來源:國家災害防救科技中心</p>\n<p>收整水利署、新聞、媒體及現勘資料2017年~2021年</p>"
                    // single_tiles:true
                    break;
                case 'Surface':
                    result = new TileLayer({
                        source: new TileWMS({
                            maxzoom: 18,
                            minzoom: 3,
                            url: 'https://dwgis1.ncdr.nat.gov.tw/server/services/MAP0627/Map2022FloodingArea1721/MapServer/WMSServer',
                            params: {
                                'LAYERS': '0',
                                'VERSION': '1.1.1',
                                'FORMAT': 'image/png',
                                'TRANSPARENT': true,
                                'STYLES': '',
                                'SRS': 'EPSG:3826',
                                'BGCOLOR': '0xFFFFFF',
                            },
                            crossOrigin: 'anonymous',
                        }),
                    })


                    // title: "近五年淹水調查位置(面)",
                    // help_btn_display: true,
                    // help_memo: "<p>資料來源:國家災害防救科技中心</p>
                    // <p>收整水利署、新聞、媒體及現勘資料2017年~2021年</p>",
                    // minzoom: 3,
                    // maxzoom: 18,
                    // layer_type: "WMS",
                    // figure_type: "Surface",
                    // single_tiles: true,
                    // tiles_url: "https://dwgis1.ncdr.nat.gov.tw/server/services/MAP0627/Map2022FloodingArea1721/MapServer/WMSServer?REQUEST=GetMap&SERVICE=WMS&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:3826&LAYERS=0&VERSION=1.1.1&FORMAT=image/png&STYLES=",
                    break;
                default:
                    console.log(figureType)
            }

        }
        if (layerType === 'GeoJson') {

        }
        return result
    }
}


// [230, 0, 0, 1] 紅色
// [104, 104, 104, 1] 灰色
// [115, 76, 0, 1] 土黃色