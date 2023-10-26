import { Tile, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式

let baseMapDataList = []

export default {
    // 傳入的是整數的話，表獲取某特定圖層，如果不是則是初始化帶入ajax獲取的底圖群組
    getBaseMapData: (value) => {
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
