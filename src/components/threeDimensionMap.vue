<script>
import OSM from 'ol/source/OSM'
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile, Tile as TileLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
// import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
// import Imageline from 'ol-ext/control/Imageline';

// import { PerspectiveView } from "ol/PluggableMap.js";


// import { createMap } from 'ol'
import PerspectiveMap from "ol-ext/map/PerspectiveMap";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from 'ol/control.js';
// import ScaleLine from 'ol-ext/control/ScaleLine';
// import { useThreeDimension } from 'ol-ext/interaction/ThreeDimension';

import 'ol-ext/dist/ol-ext.css'

export default {
    name: 'Map',
    data() {
        return {
            map: null,
        };
    },
    mounted() {
        // 配置地圖
        const view = new View({
            projection: 'EPSG:4326',
            zoom: 19,
            center: [-245406, 5986536]// [-245575, 5986863], //[-244777, 5989809]
            // enableRotation: true,
            // enableZoom: true,
            // enablePan: true,
            // enableTilt: true,
            // enableRoll: true,
            // enableZoomMax: 22,
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
        });

        this.map.setPerspective(10);
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
