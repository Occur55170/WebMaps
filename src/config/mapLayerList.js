import VectorSource from 'ol/source/Vector'
import { Image as ImageLayer, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer'
import TileWMS from 'ol/source/TileWMS'
import { bbox } from 'ol/loadingstrategy'
import GeoJSON from 'ol/format/GeoJSON'
import Static from 'ol/source/ImageStatic'
import WMTS from 'ol/source/WMTS'
import TilegridWMTS from 'ol/tilegrid/WMTS'
import 'ol/ol.css'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { getTopLeft } from 'ol/extent'
import { Fill, Style } from 'ol/style'

proj4.defs(
    'EPSG:3826',
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
)
register(proj4)

/**
 * 提取URL和參數的函數
 * @param {string} url - 完整的URL字符串
 * @returns {[string, Object]} 返回一個包含基本URL和參數對象的數組
 */
const extractUrlAndParams = (url) => {
    if (!url) return ['', {}]
    const api = new URL(url)
    const origin = api.origin
    const pathname = api.pathname
    const searchParams = api.searchParams
    const searchParamsObject = {}
    for (const [key, value] of searchParams.entries()){
        searchParamsObject[key] = value
    }
    return [origin + pathname, searchParamsObject]
}

/**
 * 根據圖層類型創建對應的圖層
 * @param {Object} layer - 圖層信息
 * @param {number} nestedSubNodeIndex - 子節點索引
 * @param {string} id - 圖層ID
 * @returns {TileLayer|ImageLayer|VectorLayer} 返回對應的圖層對象
 */
const getLayer = (layer, nestedSubNodeIndex, id) => {
    let result, layerSource
    const layerType = layer.layer_type
    const figureType = layer.figure_type
    const tileTitle = layer.single_tiles
        ? ''
        : `- ${layer.tiles_list[nestedSubNodeIndex]?.title}`

    if (layerType === 'WMS'){
        const url = layer.single_tiles
            ? layer.tiles_url
            : layer.tiles_list[nestedSubNodeIndex].tile_url
        const [requestUrl, requestParams] = extractUrlAndParams(url)

        layerSource = new TileWMS({
            maxzoom: 18,
            minzoom: 3,
            url: requestUrl,
            params: requestParams,
            serverType: 'mapserver',
            crossOrigin: 'anonymous',
        })

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

    if (layerType === 'WMTS'){
        const projection = 'EPSG:3857'
        const projectionExtent = [
            -20037508.342789244, -20037508.342789244, 20037508.342789244,
            20037508.342789244,
        ]
        const matrixIds = Array.from({ length: 21 }, (_, i) => i)
        const resolutions = Array.from(
            { length: 21 },
            (_, i) => 156543.03392804097 / Math.pow(2, i),
        )

        layerSource = new WMTS({
            url: layer.tiles_url,
            layer: layer.name,
            requestEncoding: 'REST',
            matrixSet: 'GoogleMapsCompatible',
            format: 'image/png',
            transparent: true,
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
    }

    if (layerType === 'WFS'){
        const vectorSource = new VectorSource({
            format: new GeoJSON(),
            url: layer.tiles_url,
            strategy: bbox,
        })

        const defaultStyles = new Vector().getStyleFunction()()
        const hasSelectColor = {}

        const getRandomUniqueColor = () => {
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
            return color
        }

        const layerStyle =
            layer.title === '新竹縣原住民部落範圍'
                ? (feature) => {
                    const featureGroupName = feature.get('部落名稱')
                    if (!hasSelectColor[featureGroupName]){
                        hasSelectColor[featureGroupName] = getRandomUniqueColor()
                    }
                    return new Style({
                        fill: new Fill({
                            color: hasSelectColor[featureGroupName],
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

    if (layerType === 'GeoJson'){
        const url = layer.single_tiles
            ? layer.tiles_url
            : layer.tiles_list[nestedSubNodeIndex].tile_url
        const [requestUrl, requestParams] = extractUrlAndParams(url)

        layerSource = new VectorSource({
            url: requestUrl,
            format: new GeoJSON({ geometryName: layer.title }),
        })

        result = new VectorLayer({
            id,
            label: `${layer.title}${tileTitle}`,
            source: layerSource,
        })
    }

    if (layerType === 'Image' && figureType === 'Surface'){
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
    }

    return result
}

/**
 * 解析圖層ID，並返回索引對象
 * @param {string} id - 圖層ID
 * @returns {Object} 返回包含索引的對象
 */
const getLayerIndex = (id) => {
    let nodeIndex
    let subNodeIndex
    let nestedSubNodeIndex

    if (!id){
        return {
            nodeIndex,
            subNodeIndex,
            nestedSubNodeIndex,
            id,
        }
    }

    id.split('_').forEach((element, key) => {
        switch (key){
            case 0:
                nodeIndex = Number(element.split('node')[1])
                break
            case 1:
                subNodeIndex = Number(element.split('subNode')[1])
                break
            case 2:
                nestedSubNodeIndex =
                    element.split('nestedSubNode')[1] !== 'undefined'
                        ? Number(element.split('nestedSubNode')[1])
                        : undefined
                break
        }
    })

    return {
        nodeIndex,
        subNodeIndex,
        nestedSubNodeIndex,
        id,
    }
}

/**
 * 重置圖層ID
 * @param {string} id - 原始ID
 * @param {string} keyName - 要修改的鍵名
 * @param {string} newVal - 新值
 * @returns {string} 返回新的ID
 */
const resetLayerId = (id, keyName, newVal) => {
    const result = {}
    id.split('_').forEach((item) => {
        const [key, value] = item.split('ode')
        result[key + 'ode'] = value
    })

    result[keyName] = newVal

    return Object.entries(result)
    .map(([key, value]) => `${key}${value}`)
    .join('_')
}

export default {
    getLayer,
    getLayerIndex,
    resetLayerId,
}
