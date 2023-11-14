
import { Map, View, Feature } from 'ol' // 引入容器绑定模塊和視圖模塊
import VectorSource from 'ol/source/Vector.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import TileWMS from 'ol/source/TileWMS.js'
import { bbox, tile } from 'ol/loadingstrategy.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'


import TilegridWMTS from 'ol/tilegrid/WMTS'
import { getTopLeft } from 'ol/extent'

import WMTS from 'ol/source/WMTS'
import { get as getProjection } from 'ol/proj'

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
        console.log(layerType)
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

            const layers = [
                {
                    name: 'DMAPS',
                    title: '地籍圖',
                    url: 'https://landmaps.nlsc.gov.tw/S_Maps/wmts/DMAPS/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}',
                    layer: 'DMAPS'
                },
                // {
                //     name: 'PARK',
                //     title: '國家公園',
                //     url: 'https://wmts.nlsc.gov.tw/wmts/PARK/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}',
                //     layer: 'PARK'
                // },
                // {
                //     name: 'URBAN',
                //     title: '都市計畫使用分區圖(112年2月)',
                //     url: 'https://wmts.nlsc.gov.tw/wmts/URBAN/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}',
                //     layer: 'URBAN'
                // }

            ]
        }
        if (layerType === 'WMTS'){
            const projection = 'EPSG:3857'
            const projectionExtent = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]
            const matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            const resolutions = [156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.748113140705, 152.8740565703525, 76.43702828517625, 38.21851414258813, 19.109257071294063, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.29858214173896974, 0.14929107086948487]

            layerSource = new WMTS({
                url: layer.tiles_url,
                layer: layer.name,
                requestEncoding: 'REST',
                matrixSet: 'GoogleMapsCompatible',
                format: 'image/png',
                transparente: true,
                projection,
                tileGrid: new TilegridWMTS({
                    origin: getTopLeft(projectionExtent),
                    matrixIds,
                    resolutions
                }),
                style: 'default',
                maxZoom: 20,
            })

            result = new TileLayer({
                name: layer.name,
                title: layer.title,
                type: 'overlay',
                opacity: 1.0,
                visible: true,
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
}
