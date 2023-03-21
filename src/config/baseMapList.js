import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import OSM from 'ol/source/OSM'
const key = 'Gu2rcfenfMEKjKXgPF6H'

var configBaseMap = [
    {
        name: "default",
        label: '預設',
        urls: new OSM(),
    },
    {
        name: 'roads',
        label: '底圖一',
        urls: new XYZ({
            url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
            tileSize: 512,
            maxZoom: 22,
        }),
    },
    {
        name: 'imagery',
        label: '底圖二',
        urls: new XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20,
        }),
    },
]
export default {
    sourceFun: (val, itemKey, itemValue) => {
        let mapSource = configBaseMap.find(node=> node.name == val)
        //needfix
        let vector = {
            preload: Infinity,
            name: mapSource.name,
            label: mapSource.label,
            source: mapSource.urls,
        }
        if(itemValue) {
            vector[itemKey] = itemValue
        }
        return new TileLayer(vector)
    },
    sourceData: ()=> {
        return configBaseMap.map(node=>{
            return {
                'name': node.name,
                'label': node.label
            }
        })
    }
}
