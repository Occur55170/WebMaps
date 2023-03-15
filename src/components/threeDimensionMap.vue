<script>
import OSM from 'ol/source/OSM'
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import XYZ from 'ol/source/XYZ'
import PerspectiveMap from "ol-ext/map/PerspectiveMap"

import 'ol-ext/dist/ol-ext.css'
// import Rotate from 'ol-ext/control/Rotate'

// import Rotate from 'ol-ext/control'

export default {
    name: 'Map',
    data() {
        return {
            map: null,
        };
    },


    mounted() {
        // 配置地圖
        // const view = new View({
        //     projection: 'EPSG:4326',
        //     zoom: 19,
        //     center: [-245406, 5986536]// [-245575, 5986863], //[-244777, 5989809]
        //     // enableRotation: true,
        //     // enableZoom: true,
        //     // enablePan: true,
        //     // enableTilt: true,
        //     // enableRoll: true,
        //     // enableZoomMax: 22,
        // });
        const view = new View({
            projection: 'EPSG:4326',
            zoom: 19,
            center: [-245406, 5986536]// [-245575, 5986863], //[-244777, 5989809]
        });
        const layer = new Tile({
            name: "OSM",
            preload: Infinity,
            source: new OSM()
        });

        this.map = new PerspectiveMap({
            target: 'threeDimensionMap',
            layers: [layer],
            view: new View({
                zoom: 19,
                center: [-245406, 5986536]
            }),
        })
    // const rotateControl = new Rotate({
    //     autoHide: false, // 取消自動隱藏控制項
    //     className: 'rotate', // 指定 CSS 類名
    //     duration: 250, // 旋轉動畫的持續時間(毫秒)
    //     label: '\u21C5', // 控制項標籤
    //     tipLabel: 'Reset North', // 按鈕提示
    //     threshold: 0.05, // 旋轉阈值(視角縮放因子)
    //     autoActivate: true, // 自動啟用控制項
    //     drag: true, //啟用拖動觸發
    //     onDrag: () => {
    //         //拖動時更新地圖的旋轉角度
    //         const rotation = rotateControl.getAngle();
    //         map.getView().setRotation(rotation);
    //     },
    // })

    // map.addControl(rotateControl)
    },
};

</script>
<template>
    <!-- 地圖容器 -->
    <div id="threeDimensionMap" class="threeDimensionMap"></div>
</template>

<style lang="sass" scoped>
.threeDimensionMap
    height: 100vh
    width: 100vw

</style>
