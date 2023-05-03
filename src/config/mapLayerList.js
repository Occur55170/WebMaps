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
import TileGrid from 'ol/tilegrid/TileGrid.js'
import * as olTilegrid from 'ol/tilegrid'
import * as olProj from 'ol/proj'

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

export const tribeIdList = {
    88: '石磊部',
    89: '平論文部',
    90: '抬耀部',
    91: '帛納外部',
    133: '河頭部落',
    118: '十八兒部落',
    119: '五峰部落',
    134: '泰平部落'
}

export const initLayers = async function() {
    const obj = await $.ajax({
        url: 'https://api.edtest.site/layers',
        method: 'GET'
    })
    return obj
}

export async function getTribeData (tribeId) {
    const result = await $.ajax({
        url: `https://api.edtest.site/tribe?tribeCode=${tribeId}`,
        method: "GET"
    }).done(res => {
        return res
        }).fail(FailMethod => {
        console.log('Fail', FailMethod)
        return false
        })
    return result
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

        return [raster, areaLineLayer]
        // 關閉地圖細節事件
    },
    getLayer: (layer, nestedSubNodeIndex, id) => {
        let result, layerSource
        let layerType = layer.layer_type
        let figureType = layer.figure_type
        if (layerType === 'WMS') {
            let request = [], sub = {}
            const url = isNaN(nestedSubNodeIndex) ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
            switch (figureType) {
                case 'Point':
                    // needFix: 樣式尚未套用
                    // const myStyle = new Style({
                    //     image: new Icon({
                    //         anchor: [0.5, 0.96],
                    //         src: 'https://pixlr.com/img/icon/premium-tick.svg',
                    //         crossOrigin: 'anonymous',
                    //         scale: 2,
                    //         // src: layer.tiles_url,
                    //         // width: 300,
                    //         // height: 300,
                    //     }),
                    //     stroke: new Stroke({
                    //         color: '#319FD3',
                    //         width: 1
                    //     }),
                    //     fill: new Fill({
                    //         color: '#000000',
                    //     }),
                    //     text: new Text({
                    //         font: '12px Calibri,sans-serif',
                    //         fill: new Fill({
                    //             color: '#ff0'
                    //         }),
                    //         stroke: new Stroke({
                    //             color: '#09C',
                    //             width: 3
                    //         })
                    //     })
                    // })

                    if ( url ) {
                        const api = new URL(url)
                        // 取得網址部分
                        const origin = api.origin
                        const pathname = api.pathname

                        // 取得query參數
                        const searchParams = api.searchParams;
                        const searchParamsObject = {};
                        for (const [key, value] of searchParams.entries()) {
                            searchParamsObject[key] = value;
                        }
                        request[0] = origin + pathname
                        request[1] = searchParamsObject
                    }
                    layerSource = new TileWMS({
                        maxzoom: 18,
                        minzoom: 3,
                        url: request[0],
                        params: request[1],
                        serverType: 'mapserver',
                        crossOrigin: 'anonymous',
                    })
                    break;
                case 'Surface':
                    console.log(url)
                    if ( url ) {
                        const api = new URL(url)
                        // 取得網址部分
                        const origin = api.origin
                        const pathname = api.pathname

                        // 取得query參數
                        const searchParams = api.searchParams;
                        const searchParamsObject = {};
                        for (const [key, value] of searchParams.entries()) {
                            searchParamsObject[key] = value;
                        }
                        request[0] = origin + pathname
                        request[1] = searchParamsObject
                    }
                    layerSource = new TileWMS({
                        maxzoom: 18,
                        minzoom: 3,
                        url: request[0],
                        params:  request[1],
                        serverType: 'mapserver'
                    })
                    break;
                    case 'Line':
                        // 活動斷層
                        if ( url ) {
                            const api = new URL(url)
                            // 取得網址部分
                            const origin = api.origin
                            const pathname = api.pathname

                            // 取得query參數
                            const searchParams = api.searchParams;
                            const searchParamsObject = {};
                            for (const [key, value] of searchParams.entries()) {
                                searchParamsObject[key] = value;
                            }
                            request[0] = origin + pathname
                            request[1] = searchParamsObject
                        }
                        layerSource = new TileWMS({
                            maxzoom: 18,
                            minzoom: 3,
                            url: request[0],
                            params: request[1],
                            serverType: 'mapserver'
                        })
                        break;
                default:
                    console.log('otherWMSLayer', figureType)
            }
            let tileTitle = isNaN(nestedSubNodeIndex) ? '' : `- ${ layer.tiles_list[nestedSubNodeIndex]?.title }`
            result = new TileLayer({
                id: id,
                label: `${ layer.title } ${ tileTitle }`,
                source: layerSource,
            })
        }
        if (layerType === 'GeoJson') {
            console.log('GeoJsonLayer', figureType)
            switch (figureType) {
                case 'Line':
                    result = new VectorLayer({
                        source: new VectorSource({
                            url: 'http://gis.edtest.site:8010/ogc/temp',
                            params: {
                                // http://gis.edtest.site:8010/ogc/temp
                                SERVICE: 'WMS',
                                VERSION: '1.3.0',
                                REQUEST: 'GetMap',
                                FORMAT: 'image/png',
                                STYLE: 'default',
                                SLD_VERSION: '1.1.0'
                                // LAYER: '%E6%96%B0%E7%AB%B9%E7%B8%A3%E5%8E%9F%E4%BD%8F%E6%B0%91%E9%83%A8%E8%90%BD%E7%AF%84%E5%9C%8D',
                            }
                            // url: 'https://dmap.ncdr.nat.gov.tw/GeoJson/土石流潛勢溪流.geojson',
                            // url: 'https://openlyersbook.github.io/openlayers_book_samples/assets/data/countries.geojson',
                            // format: new GeoJSON(),
                        }),
                    });

                    // help_btn_display true
                    // help_memo "<p>資料來源：農委會水土保持局</p>\n<p>111年土石流災害潛勢溪流總計為1,729條。</p>"
                    // icon "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAOUlEQVQ4jWNhoDJgGTVw1MDBYuBKhqcNjAxM9pQY9J/h38FwBukG2rgwnEG6gaoGUhOMGjhqIBkAAHaXB0Oou38UAAAAAElFTkSuQmCC"
                    // prop_show_list ['Debrisno']
                    // tile_url null
                    // tiles_list null
                    // tiles_list_description ""
                    // tiles_url "https://dmap.ncdr.nat.gov.tw/GeoJson/土石流潛勢溪流.geojson"
                    // title "土石流潛勢溪流"
                    break;
                case 'Point':
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
                    })
                    result = new TileLayer({
                        source: wmsSource,
                    })

                    // help_btn_display:true
                    // help_memo:"<p>資料來源:國家災害防救科技中心</p>\n<p>收整水利署、新聞、媒體及現勘資料2017年~2021年</p>"
                    break;
                default:
                    console.log(figureType)
            }
        }

        return result
    },
    getLayerIndex: (layeredIndex) => {
        let nodeIndex, subNodeIndex = undefined, nestedSubNodeIndex = undefined
        layeredIndex.split('_').forEach((element, key)=>{
            switch(key) {
                case 0:
                    nodeIndex = Number(element.split('node')[1])
                    break;
                case 1:
                    subNodeIndex = Number(element.split('subNode')[1])
                    break;
                case 2:
                    nestedSubNodeIndex = element.split('nestedSubNode')[1] !== 'undefined' ? Number(element.split('nestedSubNode')[1]) : 'undefined'
                    break;
            }
        })
        return {nodeIndex, subNodeIndex, nestedSubNodeIndex, layeredIndex}
    },
}


// [230, 0, 0, 1] 紅色
// [104, 104, 104, 1] 灰色
// [115, 76, 0, 1] 土黃色