import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
import VectorSource from 'ol/source/Vector.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import TileWMS from 'ol/source/TileWMS.js'
import { bbox, tile } from 'ol/loadingstrategy.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'

import 'ol/ol.css' // ol提供的css样式

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js'
proj4.defs(
    'EPSG:3826',
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
register(proj4)

export const tribeSelectorColors = [
    '#261F03',
    '#F49AAF',
    '#A9C4F6',
    '#A5A751',
    '#9C7B37',
    '#f00',
    '#6FB7B7',
    '#117800'
]

export default {
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
                label: `${layer.title}${tileTitle}`,
                // minZoom: 4,
                // maxZoom: 18,
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
        if (layerType === 'WFS'){
            const vectorSource = new VectorSource({
                format: new GeoJSON(),
                url: layer.tiles_url,
                strategy: bbox
            })
            // TODO: 加入82災害樣式
            const defaultStyles = new Vector().getStyleFunction()()
            const layerStyle = (layer.title === '新竹縣原住民部落範圍')
                ? function(feature){
                    const parts = feature.id_.split('.')
                    const lastPart = parts[parts.length - 1]
                    const style = new Style({
                        fill: new Fill({
                            color: tribeSelectorColors[lastPart] !== undefined ? tribeSelectorColors[lastPart] : '#FF0000',
                        }),
                    })
                    return style
                }
                : defaultStyles
            result = new VectorLayer({
                id,
                label: `${layer.title}${tileTitle}`,
                source: vectorSource,
                style: layerStyle,
            })
        }
        if (layerType === 'GeoJson'){
            const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
            switch (figureType){
                case 'Line':
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
                    layerSource = new VectorSource({
                        url: layer.tiles_url,
                        format: new GeoJSON(),
                    })
                    break
                case 'Point':
                    // TODO: icon優化
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
                    layerSource = new VectorSource({
                        url: layer.tiles_url,
                        format: new GeoJSON(),
                    })
                    break
                default:
                    console.log('error-otherWMSLayer:', figureType)
            }
            result = new VectorLayer({
                id,
                label: `${layer.title}${tileTitle}`,
                source: layerSource
            })
        }
        if (layerType === 'Image'){
            switch (figureType){
                case 'Surface':
                    const extent = layer.image_options.image_extent
                    const xCenter = (extent[2] + extent[0]) / 2
                    const yCenter = (extent[3] + extent[1]) / 2

                    const iconFeature = new Feature({
                        geometry: new Point([xCenter, yCenter]),
                    })

                    result = new VectorLayer({
                        name: layer.title,
                        id,
                        label: `${layer.title} ${tileTitle}`,
                        source: new VectorSource({
                            name: layer.title,
                            features: [iconFeature],
                            minzoom: 4,
                            maxZoom: 18,
                        }),
                        extra: {
                            url: layer.tiles_url
                        }
                    })
                    break
                default:
                    console.log('error-otherWMSLayer:', figureType)
            }
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
    exampleGetLayer: (layer, nestedSubNodeIndex, id) => {
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
                label: `${layer.title}${tileTitle}`,
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
        if (layerType === 'WFS'){
            const vectorSource = new VectorSource({
                format: new GeoJSON(),
                url: layer.tiles_url,
                strategy: bbox
            })
            // TODO: 加入82災害樣式
            const defaultStyles = new Vector().getStyleFunction()()
            const layerStyle = (layer.title === '新竹縣原住民部落範圍')
                ? function(feature){
                    const parts = feature.id_.split('.')
                    const lastPart = parts[parts.length - 1]
                    const style = new Style({
                        fill: new Fill({
                            color: tribeSelectorColors[lastPart] !== undefined ? tribeSelectorColors[lastPart] : '#FF0000',
                        }),
                    })
                    return style
                }
                : defaultStyles
            result = new VectorLayer({
                id,
                label: `${layer.title}${tileTitle}`,
                source: vectorSource,
                style: layerStyle,
            })
        }
        if (layerType === 'GeoJson'){
            const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
            switch (figureType){
                case 'Line':
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
                    layerSource = new VectorSource({
                        url: layer.tiles_url,
                        format: new GeoJSON(),
                    })
                    break
                case 'Point':
                    // TODO: icon優化
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
                    layerSource = new VectorSource({
                        url: layer.tiles_url,
                        format: new GeoJSON(),
                    })
                    break
                default:
                    console.log('error-otherWMSLayer:', figureType)
            }
            result = new VectorLayer({
                id,
                label: `${layer.title}${tileTitle}`,
                source: layerSource
            })
        }
        if (layerType === 'Image'){
            switch (figureType){
                case 'Surface':
                    const extent = layer.image_options.image_extent
                    const xCenter = (extent[2] + extent[0]) / 2
                    const yCenter = (extent[3] + extent[1]) / 2

                    const iconFeature = new Feature({
                        geometry: new Point([xCenter, yCenter]),
                    })

                    result = new VectorLayer({
                        name: layer.title,
                        id,
                        label: `${layer.title} ${tileTitle}`,
                        source: new VectorSource({
                            name: layer.title,
                            features: [iconFeature],
                        }),
                        minzoom: 4,
                        maxZoom: 18,
                        extra: {
                            url: layer.tiles_url
                        }
                    })
                    break
                default:
                    console.log('error-otherWMSLayer:', figureType)
            }
        }
        return result
    },
}
