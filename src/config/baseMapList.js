import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import OSM from 'ol/source/OSM'

export default {
    default: () => {
        return new TileLayer({
            preload: Infinity,
            name: 'default',
            label: '預設',
            source: new OSM(),
            enable: true
        })
    },
    roads: () => {
        const key = 'Gu2rcfenfMEKjKXgPF6H'
        return new TileLayer({
            name: 'roads',
            label: '底圖一',
            source: new XYZ({
                url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
                tileSize: 512,
                maxZoom: 22,
            }),
        })
    },
    imagery: () => {
        // url = "http://t1.openseamap.org/seamark/";
        // path = zoom + "/" + coord.x + "/" + coord.y + "." + "png";
        const key = 'Gu2rcfenfMEKjKXgPF6H'
        return new TileLayer({
            name: 'imagery',
            label: '底圖二',
            source: new XYZ({
                url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
                maxZoom: 20,
            }),
        })
    }
}
var config_basemap = [
    {
        id: "OSM", name: "OpenStreetMap", image: "OSM_MAP.png", type: "ol", opacity: 1, initVisible: true, urls: [
            {
                name: "OSM", parm: {}
            }]
    }, {
        id: "EMap", name: "通用版電子地圖", image: "EMap_MAP.png", type: "ol", opacity: 1, initVisible: false, urls: [
            {
                name: "XYZ", parm: {
                    url: "https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}",
                    wrapX: false
                }
            }]
    }, {
        id: "OrthoPhoto", name: "正射影像圖(通用版)", image: "OrthoPhoto_MAP.png", type: "ol", opacity: 1, initVisible: false, urls: [
            {
                name: "XYZ", parm: {
                    url: "https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}",
                    wrapX: false
                }
            }]
    }, {
        id: "CartoDB", name: "CartoDB地圖", image: "CartoDB_MAP.png", type: "ol", opacity: 1, initVisible: false, urls: [
            {
                name: "XYZ", parm: {
                    url: "https://{1-4}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png",
                    wrapX: false
                }
            }]
    }, {
        id: "CartoDB_Dark", name: "CartoDB地圖(深色)", image: "CartoDB_Dark_MAP.png", type: "ol", opacity: 1, initVisible: false, urls: [
            {
                name: "XYZ", parm: {
                    url: "https://{1-4}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
                    wrapX: false
                }
            }]
    }, {
        id: "CartoDB_Antique", name: "CartoDB地圖(仿古)", image: "CartoDB_Antique_MAP.png", type: "ol", opacity: 1, initVisible: false, urls: [
            {
                name: "XYZ", parm: {
                    url: "https://cartocdn_{a-d}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png",
                    wrapX: false
                }
            }]
    }
];