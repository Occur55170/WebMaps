

export default {
    sss: (value) => {
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
        console.log('value', value)
        switch (value) {
            case 'openstreetmap':
                break;
            case 'UniversalVersion':
                break;
            case 'orthophotoMap':
                break;
            case 'CartoDBMap':
                break;
            case 'CartoDB_AntiqueMap':
                break;
            default:
        }
        return 'abc'
    },
}


// OpenStreetMap：https://www.openstreetmap.org/
// 通用版電子地圖：https://maps.nlsc.gov.tw/
// 正射影像圖(通用版)：https://maps.nlsc.gov.tw/
// CartoDB地圖：https://carto.com/help/building-maps/basemap-list/
// CartoDB地圖(仿古)：https://carto.com/help/building-maps/basemap-list/
