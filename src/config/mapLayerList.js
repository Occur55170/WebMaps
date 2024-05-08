// 引入容器绑定模塊和視圖模塊
import VectorSource from 'ol/source/Vector'
import { Image as ImageLayer, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer'
import TileWMS from 'ol/source/TileWMS'
import { bbox } from 'ol/loadingstrategy'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Style } from 'ol/style'
import Static from 'ol/source/ImageStatic'

import TilegridWMTS from 'ol/tilegrid/WMTS'

import WMTS from 'ol/source/WMTS'
import { getTopLeft } from 'ol/extent'

import 'ol/ol.css' // ol提供的css样式
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js'
import { isEmpty } from '@/methods.js'

proj4.defs(
    'EPSG:3826',
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
)
register(proj4)

export default {
    getLayer: (layer, nestedSubNodeIndex, id) => {
        let result, layerSource
        const layerType = layer.layer_type
        const figureType = layer.figure_type
        const tileTitle = layer.single_tiles ? '' : `-${layer.tiles_list[nestedSubNodeIndex]?.title}`
        const request = []
        if (layerType === 'WMS') {
            const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
            switch (figureType) {
                case 'Point':
                case 'Surface':
                case 'Line':
                    // 活動斷層
                    if (url) {
                        const api = new URL(url)
                        // 取得網址部分
                        const origin = api.origin
                        const pathname = api.pathname

                        // 取得query參數
                        const searchParams = api.searchParams
                        const searchParamsObject = {}
                        for (const [key, value] of searchParams.entries()) {
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
                style: 'default',
                maxZoom: 20,
            })
        }

        if (layerType === 'WMTS') {
            switch (figureType) {
                case 'Surface':
                    // FIX: 匯出會變成gif
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
                            resolutions,
                        }),
                        style: 'default',
                        maxZoom: 20,
                    })

                    result = new TileLayer({
                        name: layer.name,
                        id,
                        label: `${layer.title}${tileTitle}`,
                        title: layer.title,
                        type: 'overlay',
                        opacity: 1.0,
                        visible: true,
                        source: layerSource,
                    })
                    break
                default:
                    console.log('error-otherWMSLayer:', figureType)
            }
        }

        // only 部落圖層點擊用layer
        if (layerType === 'WFS') {
            const vectorSource = new VectorSource({
                format: new GeoJSON(),
                url: layer.tiles_url,
                strategy: bbox,
            })
            // TODO: 加入82災害樣式
            const defaultStyles = new Vector().getStyleFunction()()
            const hasSelectColor = {}
            const layerStyle = (layer.title === '新竹縣原住民部落範圍')
                ? function (feature) {
                    const featureGroupName = feature.values_['部落名稱']
                    function getRandomUniqueColor() {
                        const usedColors = new Set()
                        const characters = '0123456789ABCDEF'
                        let color
                        do {
                            color = '#'
                            for (let i = 0; i < 6; i++) {
                                color += characters[Math.floor(Math.random() * 16)]
                            }
                        } while (usedColors.has(color))

                        usedColors.add(color)
                        hasSelectColor[featureGroupName] = color
                        return color
                    }

                    return new Style({
                        fill: new Fill({
                            color: hasSelectColor[featureGroupName] === undefined ? getRandomUniqueColor() : hasSelectColor[featureGroupName],
                        }),
                    })
                }
                : defaultStyles
            result = new VectorLayer({
                id,
                label: `${layer.title}${tileTitle}`,
                source: vectorSource,
                style: layerStyle,
            })
        }
        if (layerType === 'GeoJson') {
            const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
            switch (figureType) {
                case 'Line':
                    if (url) {
                        const api = new URL(url)
                        const {
                            origin,
                            pathname,
                            searchParams,
                        } = api
                        const searchParamsObject = {}
                        for (const [key, value] of searchParams.entries()) {
                            searchParamsObject[key] = value
                        }
                        request[0] = origin + pathname
                        request[1] = searchParamsObject
                    }
                    layerSource = new VectorSource({
                        url: layer.tiles_url,
                        format: new GeoJSON({
                            geometryName: layer.title,
                        }),
                    })
                    break
                case 'Point':
                    if (url) {
                        const api = new URL(url)
                        const {
                            origin,
                            pathname,
                            searchParams,
                        } = api
                        const searchParamsObject = {}
                        for (const [key, value] of searchParams.entries()) {
                            searchParamsObject[key] = value
                        }
                        request[0] = origin + pathname
                        request[1] = searchParamsObject
                    }
                    layerSource = new VectorSource({
                        url: layer.tiles_url,
                        format: new GeoJSON({
                            geometryName: layer.title,
                        }),
                    })
                    break
                default:
                    console.log('error-otherWMSLayer:', figureType)
            }
            result = new VectorLayer({
                id,
                label: `${layer.title}${tileTitle}`,
                source: layerSource,
            })
        }
        if (layerType === 'Image') {
            switch (figureType) {
                case 'Surface':
                    const imageLayer = new Static({
                        url: layer.tiles_image_urls[0],
                        projection: 'EPSG:4326',
                        imageExtent: layer.image_options.image_extent,
                        interpolate: true,
                    })

                    result = new ImageLayer({
                        id,
                        label: `${layer.title}${tileTitle}`,
                        source: imageLayer,
                        ext: {
                            currentLayerKey: 0,
                            tilesImageUrls: layer.tiles_image_urls,
                            imageExtent: layer.image_options.image_extent,
                        },
                    })
                    break
                default:
                    console.log('error-otherWMSLayer:', figureType)
            }
        }
        return result
    },
    getLayerIndex: (id) => {
        let nodeIndex; let subNodeIndex; let nestedSubNodeIndex
        if (!(id)) { return { nodeIndex, subNodeIndex, nestedSubNodeIndex, id } }
        id.split('_').forEach((element, key) => {
            switch (key) {
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
        return {
            nodeIndex,
            subNodeIndex,
            nestedSubNodeIndex,
            id,
        }
    },
    resetLayerId: (id, keyName, newVal) => {
        // FIXME: 使用上面getLayerIndex 做拆解
        const result = {}
        id.split('_').forEach(item => {
            const [key, value] = item.split('ode')
            result[key + 'ode'] = value
        })

        result[keyName] = newVal

        let newStr = ''
        Object.entries(result).forEach((node, key) => {
            newStr += `${node[0]}${node[1]}`
            if (key + 1 !== Object.entries(result).length) { newStr += '_' }
        })
        return newStr
    },
    get3DLayer: (layer, nestedSubNodeIndex, id) => {
        const url = layer.single_tiles ? layer.tiles_url : layer.tiles_list[nestedSubNodeIndex].tile_url
        const request = {}
        if (url) {
            const api = new URL(url)
            const { origin, pathname, searchParams } = api
            const searchParamsObject = {}
            for (const [key, value] of searchParams.entries()) {
                searchParamsObject[key] = value
            }
            request.url = origin + pathname
            request.parameters = searchParamsObject
        }

        return {
            layers: request.parameters.LAYERS || request.parameters.LAYER || request.parameters.TYPENAME || 0,
            url: request.url,
            parameters: {
                FORMAT: 'image/png',
                VERSION: request.parameters.VERSION,
                TRANSPARENT: true,
                STYLES: '',
                id,
                layers_Name: layer.single_tiles ? layer.title : `${ layer.title }-${ layer.tiles_list[nestedSubNodeIndex].title }`
            },
        }
    }
}

// 3D圖層bug
// 土石流、山崩
// -土石流潛勢溪流 //error，載入過久
// -工程鑽探 // error
// -斷層地質敏感區範圍 //沒錯誤訊息??
// 原住民與文化資源
// -新竹縣原住民部落範圍: 有畫面，但無互動事件
// -近年歷史災害82處部落點位: 有畫面，但無互動事件
// 基礎設施與公共服務
// -地方政府 // error!!
// -雨量站 //error
// 基礎設施與公共服務
// -縣市界 //error
// 沒錯誤沒畫面
// 港口
// 護理之家
// 即時預測
// -雷達回波預測: 在2D情況下就404
// -累積雨量預測: 在2D情況下就404
// -氣溫預測: 在2D情況下就404
// -風場預測: 在2D情況下就404


// // 圖層服務的 URL
// const serviceUrl = "https://gis.edtest.site/ogc/temp?SERVICE=WMS&REQUEST=GetCapabilities";

// // 發送請求獲取 Capabilities 文件
// fetch(serviceUrl)
//     .then(response => response.text())
//     .then(data => {
//         // 解析 Capabilities 文件
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(data, "text/xml");

//         // 獲取所有圖層名稱
//         const layerNames = xmlDoc.querySelectorAll("Layer > Name");
//         const layers = Array.from(layerNames).map(name => name.textContent);

//         // 輸出可用的圖層列表
//         console.log("可用的圖層列表：", layers);
//     })
//     .catch(error => {
//         console.error("發生錯誤：", error);
//     });

// 可用的圖層列表： (85) ['temp', '水系', 'riverpoly', 'riverlin', '土石流', '土石流潛勢溪流', '土石流潛勢溪流影響範圍', '大規模崩塌潛勢區', '大規模崩塌影響範圍', '順向坡', '落石分布', '山崩與地滑敏感區_新竹縣市', '潛在崩塌', '工程鑽井', '防災資訊', '避難場所', '生態資料', '全台保安林分布', '重要野鳥棲息地', '紅皮書受脅植物分布點位緩衝帶', '紅皮書受脅植物重要棲地', '國家風景區', 'VA0218V04', 'VA0206V03', 'VA0205V04', 'VA0204V04', 'VA0203V05', 'VA0083V04', 'VA0076V04', 'VA0075V04', 'VA0074V04', 'VA0018V04', 'VA0017V05', 'VA0003V04', 'VA0002V04', '自來水', '蓄水池.shp — 蓄水池', '取水口.shp — 取水口', '自來水管線.shp — 自來水管線', '災害徵兆調查結果', '潛在崩塌範圍(水保局)', '崩塌點', '居民口述疑似地滑區', '坡趾滲水', '新竹原住民', '新竹縣原住民部落範圍', '重要地標、地物', '近年歷史災害82處部落點位', '道路', '馬美道路', '隧道', '舊十八兒道路', '縣道122和竹63', '竹62', '竹60及其他路', '石磊道路', '無路名道路', '其他道路', '露營區', '新竹縣露營區.shp — 新竹縣露營區', '土地使用分區', '國家公園', '都市計畫使用分區', '非都市土地使用分區', '非都市土地使用編定', '國土利用現況調查成果圖', '國土生態綠網', '國有林事業區', '自然保留區', '自然保護區', '野生動物保護區', '野生動物重要棲息環境', '全國國土綠網區域保育軸帶', '生物多樣性熱區', '重要關注里山地景', '國土綠網關注獨流溪', '國土綠網關注農田圳溝或埤塘池沼', '國土綠網關注河川', '國土生態綠網關注區域', '全國國土綠網分區圖', '其他圖層', '雨量站', '警察局', '消防局', '學校']