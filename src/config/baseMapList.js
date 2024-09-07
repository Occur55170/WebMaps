import { Tile as TileLayer } from 'ol/layer'
import XYZ from 'ol/source/XYZ'

let baseMapDataList = []

/**
 * 根據傳入的值獲取底圖數據
 * @param {number|Object} value - 可能傳入底圖的key值或包含圖層信息的對象
 * @returns {TileLayer} 返回新的TileLayer圖層
 */
const getBaseMapData = (value) => {
    let layer

    if (Number.isInteger(value)){
        layer = baseMapDataList[value]
    } else if (value && value.layer){
        layer = value.layer
    } else {
        throw new Error('Invalid value provided to getBaseMapData')
    }

    return new TileLayer({
        preload: Infinity,
        name: layer.name,
        label: layer.label,
        type: layer.mapType,
        baseId: layer.baseId,
        source: new XYZ({
            url: layer.url,
        }),
        crossOrigin: 'anonymous',
    })
}

/**
 * 設置底圖數據
 * @param {Array} result - 底圖數據數組
 */
const setBaseMapData = (result) => {
    if (!Array.isArray(result)){
        throw new Error('Expected an array to setBaseMapData')
    }
    baseMapDataList = result
}

/**
 * 獲取當前底圖數據
 * @returns {Array} 返回當前底圖數據數組
 */
const getCurrentBase = () => {
    return baseMapDataList.filter((node) => node.onCurrent)
}

/**
 * 顯示所有底圖數據
 */
const showBaseMapData = () => {
    console.log(baseMapDataList)
}

/**
 * 獲取所有底圖數據
 * @returns {Array} 返回所有底圖數據數組
 */
export const getBaseMapAll = () => {
    return baseMapDataList
}

export default {
    getBaseMapData,
    setBaseMapData,
    getCurrentBase,
    showBaseMapData,
}
