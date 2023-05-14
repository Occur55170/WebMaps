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
export const tribeIdList = [ 88, 89, 90, 91, 133, 118, 119, 134 ]


export const initLayers = async function() {
    const obj = await $.ajax({
        url: 'https://api.edtest.site/layers',
        method: 'GET'
    })
    return obj
}

export async function getTribeData (tribeId) {
    return await $.ajax({
        url: `https://api.edtest.site/tribe?tribeCode=${tribeId}`,
        method: "GET"
    })
}

export default {
    getLayer: (layer, nestedSubNodeIndex, id) => {
        let result, layerSource
        let layerType = layer.layer_type
        let figureType = layer.figure_type
        if (layerType === 'WMS') {
            let request = []
            const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
            switch (figureType) {
                case 'Point':
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
            let tileTitle = layer.single_tiles ? '' : `- ${ layer.tiles_list[nestedSubNodeIndex]?.title }`
            result = new TileLayer({
                id: id,
                label: `${ layer.title } ${ tileTitle }`,
                source: new TileWMS({
                    name: layer.title,
                    url: layerSource.getUrls()[0],
                    params: layerSource.getParams(),
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous',
                }),
            })
        }
        // needfix: 結構混亂
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
