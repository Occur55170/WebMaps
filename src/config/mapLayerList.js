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
import { bbox, tile as tileStrategy } from 'ol/loadingstrategy.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import Projection from 'ol/proj/Projection.js'
import GeoJSON from 'ol/format/GeoJSON.js'

import 'ol/ol.css' // ol提供的css样式
import { format } from 'ol/coordinate'
import { get as getProjection, transformExtent, fromLonLat } from 'ol/proj.js'
import { getTopLeft, getWidth } from 'ol/extent.js'
import Select from 'ol/interaction/Select'
import { click } from 'ol/events/condition'
import Static from 'ol/source/ImageStatic.js'

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js'
proj4.defs(
    'EPSG:3826',
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
register(proj4)

export const initLayers = async function(){
    const obj = await $.ajax({
        url: 'https://api.edtest.site/layers',
        method: 'GET'
    })
    return obj
}

export async function getTribeData(tribeId){
    return await $.ajax({
        url: `https://api.edtest.site/tribe?tribeCode=${tribeId}`,
        method: 'GET'
    })
}

export default {
    // getLayerChatGPT: (layer, nestedSubNodeIndex, id) => {
    //     let result, layerSource
    //     const layerType = layer.layer_type
    //     const figureType = layer.figure_type
    //     const tileTitle = layer.single_tiles ? '' : `- ${layer.tiles_list[nestedSubNodeIndex]?.title}`
    //     const request = []

    //     const getUrlAndSearchParams = (url) => {
    //         const api = new URL(url)
    //         const origin = api.origin
    //         const pathname = api.pathname
    //         const searchParams = api.searchParams
    //         const searchParamsObject = Object.fromEntries(searchParams.entries())
    //         return [origin + pathname, searchParamsObject]
    //     }

    //     switch (layerType){
    //         case 'WMS':
    //             const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex]?.tile_url
    //             if (url){
    //                 [request[0], request[1]] = getUrlAndSearchParams(url)
    //             }

    //             layerSource = new TileWMS({
    //                 maxzoom: 18,
    //                 minzoom: 3,
    //                 url: request[0],
    //                 params: request[1],
    //                 serverType: 'mapserver',
    //                 crossOrigin: 'anonymous',
    //             })

    //             result = new TileLayer({
    //                 id,
    //                 label: `${layer.title} ${tileTitle}`,
    //                 source: new TileWMS({
    //                     name: layer.title,
    //                     url: layerSource.getUrls()[0],
    //                     params: layerSource.getParams(),
    //                     serverType: 'geoserver',
    //                     crossOrigin: 'anonymous',
    //                     projection: layerSource.getParams()?.SRS,
    //                 }),
    //             })
    //             break

    //         case 'WFS':
    //             const vectorSource = new VectorSource({
    //                 format: new GeoJSON(),
    //                 url: layer.tiles_url,
    //                 strategy: bbox,
    //             })

    //             result = new Vector({
    //                 id,
    //                 label: `${layer.title} ${tileTitle}`,
    //                 source: vectorSource,
    //             })
    //             break

    //         case 'GeoJson':
    //             const geoJsonUrl = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex]?.tile_url
    //             if (geoJsonUrl){
    //                 [request[0], request[1]] = getUrlAndSearchParams(geoJsonUrl)
    //             }

    //             layerSource = new TileWMS({
    //                 maxzoom: 18,
    //                 minzoom: 3,
    //                 url: request[0],
    //                 params: request[1],
    //                 serverType: 'mapserver',
    //             })

    //             result = new VectorLayer({
    //                 source: new VectorSource({
    //                     url: layerSource.getUrls()[0],
    //                     params: layerSource.getParams(),
    //                     serverType: 'geoserver',
    //                     crossOrigin: 'anonymous',
    //                     projection: layerSource.getParams()?.SRS,
    //                 }),
    //             })
    //             break

    //         case 'Image':
    //             const imageUrl = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex]?.tile_url
    //             if (imageUrl){
    //                 [request[0], request[1]] = getUrlAndSearchParams(imageUrl)
    //             }

    //             layerSource = new TileWMS({
    //                 maxzoom: 18,
    //                 minzoom: 3,
    //                 url: request[0],
    //                 params: request[1],
    //                 serverType: 'mapserver',
    //             })

    //             result = new VectorLayer({
    //                 source: new VectorSource({
    //                     url: layerSource.getUrls()[0],
    //                     params: layerSource.getParams(),
    //                     serverType: 'geoserver',
    //                     crossOrigin: 'anonymous',
    //                     projection: layerSource.getParams()?.SRS,
    //                 }),
    //             })
    //             break

    //         default:
    //             console.log('error-otherWMSLayer:', figureType)
    //     }
    //     return result
    // },
    getLayer: (layer, nestedSubNodeIndex, id) => {
        let result, layerSource
        const layerType = layer.layer_type
        const figureType = layer.figure_type
        const tileTitle = layer.single_tiles ? '' : `- ${layer.tiles_list[nestedSubNodeIndex]?.title}`
        const request = []
        if (layerType === 'WMS'){
            const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
            switch (figureType){
                case 'Point':
                    if (url){
                        const api = new URL(url)
                        // 取得網址部分
                        const origin = api.origin
                        const pathname = api.pathname

                        // 取得query參數
                        const searchParams = api.searchParams
                        const searchParamsObject = {}
                        for (const [key, value] of searchParams.entries()){
                            searchParamsObject[key] = value
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
                    break
                case 'Surface':
                    if (url){
                        const api = new URL(url)
                        // 取得網址部分
                        const origin = api.origin
                        const pathname = api.pathname

                        // 取得query參數
                        const searchParams = api.searchParams
                        const searchParamsObject = {}
                        for (const [key, value] of searchParams.entries()){
                            searchParamsObject[key] = value
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
                    break
                case 'Line':
                    // 活動斷層
                    if (url){
                        const api = new URL(url)
                        // 取得網址部分
                        const origin = api.origin
                        const pathname = api.pathname

                        // 取得query參數
                        const searchParams = api.searchParams
                        const searchParamsObject = {}
                        for (const [key, value] of searchParams.entries()){
                            searchParamsObject[key] = value
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
                    break
                default:
                    console.log('error-otherWMSLayer:', figureType)
            }
            result = new TileLayer({
                id,
                label: `${layer.title} ${tileTitle}`,
                source: new TileWMS({
                    name: layer.title,
                    url: layerSource.getUrls()[0],
                    params: layerSource.getParams(),
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous',
                    projection: layerSource.getParams()?.SRS,
                }),
            })
        }
        // only 部落圖層點擊用layer
        // TODO: 加入背景顏色
        if (layerType === 'WFS'){
            const vectorSource = new VectorSource({
                format: new GeoJSON(),
                url: layer.tiles_url,
                strategy: bbox
            })
            result = new Vector({
                id,
                label: `${layer.title} ${tileTitle}`,
                source: vectorSource
            })
        }
        if (layerType === 'GeoJson'){
            const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
            switch (figureType){
                case 'Line':
                    // FIXME: 土石流潛勢溪流 失效
                    if (url){
                        const api = new URL(url)
                        const { origin, pathname, searchParams } = api
                        const searchParamsObject = {}
                        for (const [key, value] of searchParams.entries()){
                            searchParamsObject[key] = value
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
                    break
                case 'Point':
                    // FIXME: 雨量站 失效
                    if (url){
                        const api = new URL(url)
                        const { origin, pathname, searchParams } = api
                        const searchParamsObject = {}
                        for (const [key, value] of searchParams.entries()){
                            searchParamsObject[key] = value
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
                    result = new TileLayer({
                        source: layerSource,
                    })
                    break
                default:
                    console.log('error-otherWMSLayer:', figureType)
            }
            result = new VectorLayer({
                source: new VectorSource({
                    url: layerSource.getUrls()[0],
                    params: layerSource.getParams(),
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous',
                    projection: layerSource.getParams()?.SRS,
                }),
            })
        }
        if (layerType === 'Image'){
            console.log(layer)
            const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
            // let a = [117.1595,
            // 21.2646,
            // 123.9804,
            // 26.5353]
            const extent = [0, 0, 1024, 968]
            const projection = new Projection({
                code: 'xkcd-image',
                units: 'pixels',
                extent,
            })
            result = new ImageLayer({
                source: new Static({
                    url: 'https://s3.ap-northeast-1.amazonaws.com/common.cwb.images/ncdr/forecast.png?AWSAccessKeyId=ASIAU6XV5PTRLJK2P3I2&Signature=H8fIgvFpJtN25FJQ7wI8XYXvpyQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEFwaDmFwLW5vcnRoZWFzdC0xIkYwRAIfFinJqG4UmImmCrf6%2FLdfuLY2SkCZb1%2Fd04AW3oL8RAIhAP%2BqNqdbJRg1HRs7E5tJMKWY65UzSlJVnmpdHjEg9WA3KoIDCNX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMzQwODkxODkyOTYyIgxb1MtkkbBOCsajf10q1gJQV2mOT2XsxGa8nFXJPXAJ2ymYuwbunwJMtu5lVV3Z5Cs0JaMPSwhLxwc8zJbIAvO61CNpu4ztWGRhp76rWsNyAAP2ODnavgWu%2BY9tLRxHFJKP%2FereOVELlxLl3ZYETBkgWaa9bpg0CfMF0mXPZn61mPkL6zd0IraBmlBZi0jNeC8ETBxp6RBpyXUXpUF1v8E4jragBSq1eXja0b7XVin766E7WJWHF9QutnbHdaRzeuV%2B0xZpD8GIlLWuRsgPSy55niCeIc47U8w0N%2F8mvZxhwvdETs54RNOL%2FVMnrppz%2F2YYfDePn81wiOtotPIvdsARu4tLydOEdtbCkl3rFwPjN5ibsg0LE2DiK%2FKCeUpf6JALPjUKB9Pyh8EAp7xWDIz8Fb1eMokinZovD%2BZMcCpy8QojJTVABqY6EBInzV851MgYCzkeZulHuyCDLGaKdK8DDwVaXLYw0Km6pQY6nwFfHh4MfRPiAQs2euDmQMR41x7MYred35tJEhaSgHoECqGAIhEZkR4YgabY5FREk5AFOya%2FgLdLC%2F4EyM65Fq5BU4B1nkRX8awb3uEQ6Kl2m3Xdp%2Br2CM3w28mRkF1fMxADNcjNTULp4ZiLNfRXdKWK%2Fy5zt8CerCtfIizKxr5pfLlCJ2whdb5ICs8KujA3h%2F4b2fsYqxVeYNALi5nlGGI%3D&Expires=1689163759',
                    imageExtent: [117.1595, 21.2646, 123.9804, 26.5353],
                    projection: 'EPSG:4326',
                }),
            })
            // switch (figureType){
            //     case 'Surface':
            //         console.log(layer)
            //         // TODO: 雨量站 失效
            //         if (url){
            //             const api = new URL(url)
            //             const { origin, pathname, searchParams } = api
            //             const searchParamsObject = {}
            //             for (const [key, value] of searchParams.entries()){
            //                 searchParamsObject[key] = value
            //             }
            //             request[0] = origin + pathname
            //             request[1] = searchParamsObject
            //         }
            //         layerSource = new TileWMS({
            //             maxzoom: 18,
            //             minzoom: 3,
            //             url: request[0],
            //             params: request[1],
            //             serverType: 'mapserver'
            //         })
            //         result = new TileLayer({
            //             source: layerSource,
            //         })
            //         break
            //     default:
            //         console.log('error-otherWMSLayer:', figureType)
            // }
            // result = new VectorLayer({
            //     source: new VectorSource({
            //         url: layerSource.getUrls()[0],
            //         params: layerSource.getParams(),
            //         serverType: 'geoserver',
            //         crossOrigin: 'anonymous',
            //         projection: layerSource.getParams()?.SRS,
            //     }),
            // })
        }
        return result
    },
    getLayerIndex: (layeredIndex) => {
        let nodeIndex; let subNodeIndex; let nestedSubNodeIndex
        if (!(layeredIndex)){ return { nodeIndex, subNodeIndex, nestedSubNodeIndex, layeredIndex } }
        layeredIndex.split('_').forEach((element, key) => {
            switch (key){
                case 0:
                    nodeIndex = Number(element.split('node')[1])
                    break
                case 1:
                    subNodeIndex = Number(element.split('subNode')[1])
                    break
                case 2:
                    nestedSubNodeIndex = element.split('nestedSubNode')[1] !== 'undefined' ? Number(element.split('nestedSubNode')[1]) : 'undefined'
                    break
            }
        })
        return { nodeIndex, subNodeIndex, nestedSubNodeIndex, layeredIndex }
    },
}
