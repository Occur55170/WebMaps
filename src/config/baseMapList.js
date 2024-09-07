import { Tile } from 'ol/layer'
import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式

let baseMapDataList = []

export default {
    getBaseMapData: (value) => { // 可能傳入底圖的key值
        let layer
        if (Number.isInteger(value)){
            layer = baseMapDataList[value]
        } else {
            layer = value.layer
        }

        return new Tile({
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
    },
    setBaseMapData: (result) => {
        baseMapDataList = result
    },
    getCurrentBase: () => {
        return baseMapDataList.filter(node => node.onCurrent)
    },
    showBaseMapData: () => {
        console.log(baseMapDataList)
    },
}

export function getBaseMapAll(){
    return baseMapDataList
}
