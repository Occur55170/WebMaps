// import $ from 'jquery'
import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
import VectorSource from 'ol/source/Vector.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import TileWMS from 'ol/source/TileWMS.js'
import { bbox, tile } from 'ol/loadingstrategy.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'
import ImageWMS from 'ol/source/ImageWMS.js'
import Static from 'ol/source/ImageStatic.js'

import TilegridWMTS from 'ol/tilegrid/WMTS'

import { createXYZ } from 'ol/tilegrid.js'
import WMTS from 'ol/source/WMTS'
import { get as getProjection } from 'ol/proj'
import { getTopLeft, getWidth } from 'ol/extent.js'

import 'ol/ol.css' // ol提供的css样式

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js'
proj4.defs(
    'EPSG:3826',
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
register(proj4)

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
                style: 'default',
                maxZoom: 20,
            })
        }

        if (layerType === 'WMTS'){
            layerSource = new ImageWMS({
                url: 'https://ahocevar.com/geoserver/wms',
                params: { LAYERS: 'topp:states' },
                serverType: 'geoserver',
            })

            result = new ImageWMS({
                name: layer.name,
                id,
                label: `${layer.title}${tileTitle}`,
                title: layer.title,
                source: layerSource
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
            const hasSelectColor = {}
            const layerStyle = (layer.title === '新竹縣原住民部落範圍')
                ? function(feature){
                    const featureGroupName = feature.values_['部落名稱']
                    function getRandomUniqueColor(){
                        const usedColors = new Set()
                        const characters = '0123456789ABCDEF'
                        let color
                        do {
                            color = '#'
                            for (let i = 0; i < 6; i++){
                                color += characters[Math.floor(Math.random() * 16)]
                            }
                        } while (usedColors.has(color))

                        usedColors.add(color)
                        hasSelectColor[featureGroupName] = color
                        return color
                    }

                    const style = new Style({
                        fill: new Fill({
                            color: hasSelectColor[featureGroupName] === undefined ? getRandomUniqueColor() : hasSelectColor[featureGroupName]
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
                        format: new GeoJSON({
                            geometryName: layer.title
                        }),
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
                        format: new GeoJSON({
                            geometryName: layer.title
                        }),
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
                    console.log(layer.tiles_image_urls)
                    const imageLayer = new Static({
                        url: layer.tiles_image_urls[0],
                        projection: 'EPSG:4326',
                        imageExtent: false ? layer.image_options.image_extent : [119.18, 21.45, 124.34, 26.56],
                        interpolate: true,
                    })

                    result = new ImageLayer({
                        id,
                        label: `${layer.title}${tileTitle}`,
                        source: imageLayer,
                        // FIXME: 考慮額外帶值出去
                        ext: {
                            currentKey: 0,
                            imgList: layer.tiles_image_urls
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
}
