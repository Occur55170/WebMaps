import { Tile, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import OSM from 'ol/source/OSM.js'

let baseMapDataList = []

export default {
    getBaseMapData: (value) => { // 可能傳入底圖的key值
        let layer
        if (Number.isInteger(value)){
            layer = baseMapDataList[value]
        } else {
            layer = value.layer
        }

        const newTileLayer = new Tile({
            preload: Infinity,
            name: layer.name,
            label: layer.label,
            type: layer.mapType,
            baseId: layer.baseId,
            source: new XYZ({
                url: layer.url
            }),
            crossOrigin: 'anonymous',
        })
        return newTileLayer
    },
    setBaseMapData: (result) => {
        baseMapDataList = result
    },
    getCurrentBase: () => {
        return baseMapDataList.filter(node => node.onCurrent)
    },
    showBaseMapData: () => {
        console.log(baseMapDataList)
    }
}

export function getBaseMapAll(){
    return baseMapDataList
}
