import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import XYZ from 'ol/source/XYZ' // 引入XYZ地圖格式
import OSM from 'ol/source/OSM'
import $ from 'jquery'
const key = 'Gu2rcfenfMEKjKXgPF6H'

const configBaseMap = [
    {
        name: 'default',
        label: '預設',
        urls: new OSM(),
        crossOrigin: 'anonymous'
    },
    {
        name: 'roads',
        label: '底圖一',
        urls: new XYZ({
            url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
            tileSize: 512,
            maxZoom: 22,
            crossOrigin: 'anonymous'
        }),
    },
    {
        name: 'imagery',
        label: '底圖二',
        urls: new XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20,
            crossOrigin: 'anonymous'
        }),
    },
]
const testAry = []

// FIXME: 此處為寫死，之後改成打ajax 'https://api.edtest.site/underLayers' 帶資料
const baseMapDataList = [
    {
        name: 'source_nlsc_EMAP',
        type: 'baseMap',
        label: '臺灣通用電子地圖',
        url: 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{z}/{y}/{x}'
    },
    {
        name: 'source_nlsc_PHOTO2',
        type: 'baseMap',
        label: '正射影像圖(臺灣通用)',
        url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}'
    },
    {
        name: 'source_nlsc_LUIMAP',
        type: 'baseMap',
        label: '國土利用調查成果圖',
        url: 'https://wmts.nlsc.gov.tw/wmts/LUIMAP/default/EPSG:3857/{z}/{y}/{x}'
    },
    {
        name: 'source_gm_m',
        type: 'baseMap',
        label: 'Google 電子地圖',
        url: 'https://mt{1-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
    },
    {
        name: 'source_gm_s',
        type: 'baseMap',
        label: 'Google 衛星地圖',
        url: 'https://mt{1-3}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
    },
    {
        name: 'source_gm_y',
        type: 'baseMap',
        label: 'Google 混合地圖',
        url: 'https://mt{1-3}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
    },
    {
        name: 'source_gm_p',
        type: 'baseMap',
        label: 'Google 地形圖',
        url: 'https://mt{1-3}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
    },
    {
        name: 'source_moeacgs_CGS',
        type: 'baseMap',
        label: '地調所地質圖(五萬分之一)',
        url: 'https://gis3.moeacgs.gov.tw/api/Tile/v1/getTile.cfm?layer=CGS_CGS_MAP&x={x}&y={y}&z={z}'
    },
    {
        name: 'source_osm_m',
        type: 'baseMap',
        label: 'OSM 電子地圖',
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
]
async function initBaseMapData(){
    await $.ajax({
        url: 'https://api.edtest.site/underLayers',
        method: 'GET'
    }).done(res => {
        console.log(res)
    }).fail(FailMethod => {
        console.log('Fail', FailMethod)
    })
}

export default {
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
            source: new XYZ({
                url: layer.url
            }),
            crossOrigin: 'anonymous',
        })
        return newTileLayer
    },
}
