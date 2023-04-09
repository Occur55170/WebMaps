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

let obj
    ; (async () => {
        await $.ajax({
            url: 'https://api.edtest.site/layers',
            method: 'GET',
            dataType: '',
            success: (res) => {
                obj = res.map((node) => node)
            },
            error: (err) => {
                return err
            },
        });
    })();
export async function initLayers() {
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
                        request = url.split("WMSServer?")
                        request[1] = request[1].split('&')
                        request[1].forEach(node=>{
                            const subNode = node.split('=')
                            sub[subNode[0]] = subNode[1]
                        })
                    }
                    layerSource = new TileWMS({
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
                        serverType: 'mapserver',
                        crossOrigin: 'anonymous',
                    })
                    layerSource = new TileWMS({
                        maxzoom: 18,
                        minzoom: 3,
                        url: request[0] + 'WMSServer?',
                        params: sub,
                        serverType: 'mapserver'
                    })
                    break;
                case 'Surface':
                    if ( url ) {
                        request = url.split("WMSServer?")
                        request[1] = request[1].split('&')
                        request[1].forEach(node=>{
                            const subNode = node.split('=')
                            sub[subNode[0]] = subNode[1]
                        })
                    }
                    // needFix!!
                    // "https://dwgis.ncdr.nat.gov.tw/arcgis/services/ncdr/NCDR_Maps/MapServer/WmsServerhttps://dwgis1.ncdr.nat.gov.tw/server/services/MAP0627/Map2022PotentialSeaZone/MapServer/WMSServer?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&LAYERS=1&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:3826"
                    // url: 'https://dwgis1.ncdr.nat.gov.tw/server/services/MAP0627/Map2022FloodingArea1721/MapServer/WMSServer?REQUEST=GetMap&SERVICE=WMS&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:3826&LAYERS=0&VERSION=1.1.1&FORMAT=image/png&STYLES=',
                    // url: 'https://dwgis1.ncdr.nat.gov.tw/server/services/MAP0627/Map2022FloodingArea1721/MapServer/WMSServer',
                    // items_group
                    layerSource = new TileWMS({
                        maxzoom: 18,
                        minzoom: 3,
                        url: request[0] + 'WMSServer?',
                        params: sub,
                        serverType: 'mapserver'
                    })
                    break;
                    case 'Line':
                        // 活動斷層
                        if ( url ) {
                            request = url.split("WMSServer?")
                            request[1] = request[1].split('&')
                            request[1].forEach(node=>{
                                const subNode = node.split('=')
                                sub[subNode[0]] = subNode[1]
                            })
                        }
                        layerSource = new TileWMS({
                            maxzoom: 18,
                            minzoom: 3,
                            url: request[0] + 'WMSServer?',
                            params: sub,
                            serverType: 'mapserver'
                        })
                        // figure_type:"Line"
                        // help_btn_display:true
                        // help_memo:"<p>資料來源：中央地質調查所</p>\n<p>目前本網站所使用之斷層圖層為2021年版本，共36條活動斷層</p>"
                        // icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAPklEQVQ4jWNhoDJgGTVw1MDBZOB/Bob/+BQyMjAw/mdg2M/AwOCAi09bF8JsIOBKR3x8FAOpBUYNHDWQDAAAYp0G15wEqdwAAAAASUVORK5CYII="
                        // id:"node2_subNode1_nestedSubNodeundefined"
                        // info_box:null
                        // layer_type:"WMS"
                        // maxzoom:18
                        // minzoom:3
                        // prop_show_list:null
                        // single_tiles:true
                        // tile_url:null
                        // tiles_list:null
                        // tiles_list_description:""
                        // tiles_url:"https://dwgis1.ncdr.nat.gov.tw/server/services/MAP0627/Map2022Faults/MapServer/WMSServer?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&LAYERS=0&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:3826"
                        // title:"活動斷層"
                        // let request = []
                        // let sub = {}
                        // const url = isNaN(nestedSubNodeIndex) ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
                        // if ( url ) {
                        //     request = url.split("WMSServer?")
                        //     request[1] = request[1].split('&')
                        //     request[1].forEach(node=>{
                        //         const subNode = node.split('=')
                        //         sub[subNode[0]] = subNode[1]
                        //     })
                        // }
                        // layerSource = new TileWMS({
                        //     maxzoom: 18,
                        //     minzoom: 3,
                        //     url: request[0] + 'WMSServer?',
                        //     params: sub,
                        //     serverType: 'mapserver'
                        // })
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
                            url: 'https://dmap.ncdr.nat.gov.tw/GeoJson/土石流潛勢溪流.geojson',
                            format: new GeoJSON(),
                            crossOrigin: 'anonymous',

                            // url: 'https://openlayersbook.github.io/openlayers_book_samples/assets/data/countries.geojson',
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