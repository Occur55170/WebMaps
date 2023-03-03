import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import OSM from 'ol/source/OSM'

export default {
    default: ()=>{
        return new TileLayer({
            preload: Infinity,
            name: 'default',
            source: new OSM(),
            enable: true
        })
    },
    roads: () => {
        const key = 'Gu2rcfenfMEKjKXgPF6H'
        return new TileLayer({
            name: 'roads',
            source: new XYZ({
                url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
                tileSize: 512,
                maxZoom: 22,
            }),
        })
    },
    imagery: () => {
        const key = 'Gu2rcfenfMEKjKXgPF6H'
        return new TileLayer({
            name: 'imagery',
            source: new XYZ({
                url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
                maxZoom: 20,
            }),
        })
    }
}


// OpenStreetMap：https://www.openstreetmap.org/
// 通用版電子地圖：https://maps.nlsc.gov.tw/
// 正射影像圖(通用版)：https://maps.nlsc.gov.tw/
// CartoDB地圖：https://carto.com/help/building-maps/basemap-list/
// CartoDB地圖(仿古)：https://carto.com/help/building-maps/basemap-list/
